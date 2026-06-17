import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import api from "../api/client.js";
import { SOCKET_URL } from "../config.js";
import { useAuth } from "./auth.jsx";

const NotificationContext = createContext();

// Heuristic: don't toast a "new message" when the user is already looking at
// the chat. Patients chat at /doctors/list?id=..., doctors at /patients.
const isViewingChat = () => {
  const { pathname, search } = window.location;
  if (pathname.startsWith("/patients")) return true;
  if (pathname.startsWith("/doctors/list") && new URLSearchParams(search).has("id"))
    return true;
  return false;
};

export const NotificationProvider = ({ children }) => {
  const { userID, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!userID) return;
    try {
      const { data } = await api.get("/api/notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Errors are already surfaced by the api interceptor.
    }
  }, [userID]);

  // Once a chat is opened its notifications are "seen" — delete them so they
  // disappear from the bell and from the per-chat counts. Optimistically prune
  // local state first so the UI updates instantly.
  const clearChat = useCallback(
    async (chatId) => {
      if (!userID) return;
      // Optimistically prune local state so the UI updates instantly.
      setNotifications((prev) => {
        const next = chatId
          ? prev.filter((n) => String(n.chatId) !== String(chatId))
          : [];
        setUnreadCount(next.length);
        return next;
      });
      try {
        await api.post("/api/notifications/clear", chatId ? { chatId } : {});
        await refresh();
      } catch {
        /* surfaced by interceptor */
      }
    },
    [userID, refresh]
  );

  // How many unseen messages are waiting in a given chat.
  const unreadForChat = useCallback(
    (chatId) =>
      notifications.filter((n) => String(n.chatId) === String(chatId)).length,
    [notifications]
  );

  // Connect one app-wide socket while logged in, join the user's own room
  // (matches the server's `setup` handler) and listen for incoming messages.
  useEffect(() => {
    if (!isLoggedIn || !userID) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    refresh();

    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit("setup", { _id: userID });

    socket.on("message recieved", (msg) => {
      refresh();
      if (!isViewingChat()) {
        const who = msg?.sender?.name || "someone";
        toast(`New message from ${who}`, { icon: "🔔" });
      }
    });

    return () => {
      socket.off("message recieved");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, userID, refresh]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, refresh, clearChat, unreadForChat }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
};
