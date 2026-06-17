import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import NotificationDropdown from "../../pages/NotificationDropdown";
import { useEffect, useState } from "react";
import { FaBell, FaEnvelope } from "react-icons/fa";
import api from "../../api/client.js";
import { useAuth } from "../../store/auth";
import { useNotifications } from "../../store/notifications.jsx";

const PLACEHOLDER = {
  doctor: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  patient: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
};

export const Header = () => {
  const { role, userID: doctorId } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // Chat-message notifications (both roles), from the app-wide provider.
  const { notifications: messageNotifs, unreadCount } = useNotifications();
  const [showMessages, setShowMessages] = useState(false);

  const toggleDropdown = () => setShowDropdown((s) => !s);

  // Opening the bell only previews messages — notifications are removed when
  // the actual chat is opened, not just glanced at.
  const toggleMessages = () => setShowMessages((s) => !s);

  // Jump toward the relevant chat. We do NOT clear here — the count should
  // only disappear once the actual conversation is opened (the patient's
  // UserChat / the doctor selecting that patient), which clears it then.
  const openChat = (notif) => {
    setShowMessages(false);
    if (role === "patient") {
      navigate(`/doctors/list?id=${notif.sender?.userId}`);
    } else if (role === "doctor") {
      navigate("/patients");
    }
  };

  // Collapse multiple messages from the same chat into one row with a count.
  const groupedMessages = Object.values(
    (messageNotifs || []).reduce((acc, n) => {
      const key = String(n.chatId);
      if (!acc[key]) acc[key] = { ...n, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {})
  );

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/api/doctor/notifications/${doctorId}`);
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  // Pull the logged-in user's uploaded profile photo for the navbar.
  const fetchAvatar = async () => {
    try {
      if (role === "patient") {
        const { data } = await api.get("/api/me");
        setAvatar(data.user?.profilePicture || null);
      } else if (role === "doctor") {
        const { data } = await api.get("/api/doctor/me");
        setAvatar(data.user?.profilepic || null);
      }
    } catch {
      setAvatar(null);
    }
  };

  useEffect(() => {
    if (role === "doctor") fetchNotifications();
    if (role === "doctor" || role === "patient") fetchAvatar();

    // Update the navbar photo immediately after an upload on the profile page.
    const onAvatarUpdated = () => fetchAvatar();
    window.addEventListener("avatar-updated", onAvatarUpdated);
    return () => window.removeEventListener("avatar-updated", onAvatarUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const avatarSrc = avatar || PLACEHOLDER[role] || PLACEHOLDER.default;

  const renderAuthButtons = () => {
    switch (role) {
      case "doctor":
        return (
          <>
            <Link to="/doctor/profile" className="profile-icon">
              <img src={avatarSrc} alt="Profile" className="avatar" />
            </Link>
            <Link to="/logout" className="auth-btn">Logout</Link>
          </>
        );
      case "patient":
        return (
          <>
            <Link to="/user/profile" className="profile-icon">
              <img src={avatarSrc} alt="Profile" className="avatar" />
            </Link>
            <Link to="/logout" className="auth-btn">Logout</Link>
          </>
        );
      default:
        return (
          <>
            <Link to="/login" className="auth-btn">Login</Link>
            <Link to="/signup" className="auth-btn">Signup</Link>
          </>
        );
    }
  };

  return (
    <nav className="navbar">
      <div className="left-section">
        <div className="logo">
          <Link to="/">HealthBridge</Link>
        </div>

        {role !== "lab" && (
          <ul className="nav-links">
            {role === "patient" && (
              <>
                <li><Link to="/doctors">Doctors</Link></li>
                <li><Link to="/medicines">Medicines</Link></li>
                <li><Link to="/lab-tests">Lab Tests</Link></li>
                <li><Link to="/reports">Reports</Link></li>
              </>
            )}
            {role === "doctor" && (
              <>
                <li><Link to="/patients">Patients</Link></li>
                <li><Link to="/slots">Slots</Link></li>
                <li><Link to="/upload">Upload Report</Link></li>
              </>
            )}
          </ul>
        )}
      </div>

      <div className="right-section">
        {/* Chat-message notifications — for patients and doctors alike. */}
        {(role === "patient" || role === "doctor") && (
          <div className="notification-container">
            <div className="bell-wrapper" onClick={toggleMessages}>
              <FaEnvelope className="bell-icon" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </div>
            {showMessages && (
              <div className="notification-dropdown">
                <div className="notification-dropdown__head">Messages</div>
                {groupedMessages.length === 0 ? (
                  <div className="notification-empty">
                    <span role="img" aria-label="bell">🔔</span>
                    <p>No new messages</p>
                  </div>
                ) : (
                  groupedMessages.map((n) => (
                    <div
                      key={n.chatId}
                      className="notification-item msg-notif is-unread"
                      onClick={() => openChat(n)}
                    >
                      <div className="notification-item__avatar">
                        {n.sender?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="msg-notif__body">
                        <span className="notification-item__name">
                          {n.sender?.role === "doctor" ? "Dr. " : ""}
                          {n.sender?.name || "Someone"}
                        </span>
                        <span className="msg-notif__preview">{n.content}</span>
                      </div>
                      {n.count > 1 && (
                        <span className="msg-notif__count">{n.count}</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {role === "doctor" && (
          <div className="notification-container">
            <div className="bell-wrapper" onClick={toggleDropdown}>
              <FaBell className="bell-icon" />
              {notifications && notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </div>
            {showDropdown && (
              <NotificationDropdown
                notifications={notifications}
                fetchNotifications={fetchNotifications}
              />
            )}
          </div>
        )}

        {renderAuthButtons()}
      </div>
    </nav>
  );
};
