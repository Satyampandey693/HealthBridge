import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useAuth } from "../../store/auth";
import "./DoctorChat.css";

const ENDPOINTS = "http://localhost:5000";

// We accept props from MyPatients.jsx
export const DoctorChat = ({ activePatientId, activeChatId,activePatientName }) => {
  const doctorId = localStorage.getItem("userID");
  const { authorizationToken } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Use a ref for the socket to avoid re-initializing on every render
  const socket = useRef(null);

  // 1. Initial Socket Setup
  useEffect(() => {
    socket.current = io(ENDPOINTS);
    socket.current.emit("setup", { _id: doctorId });
    socket.current.on("connected", () => setSocketConnected(true));

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [doctorId]);

  // 2. Listen for incoming messages via Socket
  useEffect(() => {
    if (!socket.current) return;

    const handleMessageReceived = (newMessageReceived) => {
      // Only add message to state if it belongs to the currently open chat
      if (activePatientId === newMessageReceived.chat._id || 
          activePatientId === newMessageReceived.sender._id) {
        setMessages((prev) => [...prev, newMessageReceived]);
      } else {
        toast.info(`New message from another patient`);
      }
    };

    socket.current.on("message recieved", handleMessageReceived);

    return () => {
      socket.current.off("message recieved", handleMessageReceived);
    };
  }, [activePatientId]);

  // 3. Fetch Messages whenever the prop 'activePatientId' changes
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId]);

  // 4. Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (chatId) => {
    try {
      // Hits /api/message/CHAT_MODEL_ID_456
      const { data } = await axios.get(`${ENDPOINTS}/api/message/${chatId}`, {
        headers: { Authorization: authorizationToken },
        withCredentials: true,
      });
      setMessages(data);
      socket.current.emit("join chat", chatId); // Joins the UNIQUE chat room
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChatId) return;

    const messageData = {
      content: newMessage,
      chatId: activeChatId, // Uses the SHARED chat model ID
      senderId: doctorId,
    };

    try {
      const { data } = await axios.post(`${ENDPOINTS}/api/message`, messageData, {
        headers: { Authorization: authorizationToken },
        withCredentials: true,
      });
      socket.current.emit("new message", data);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="chat-area-wrapper">
      <div className="chat-header">
        <h3>Chatting with {activePatientName}</h3>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble-wrapper ${
              String(msg.sender._id || msg.sender) === String(doctorId) ? "right" : "left"
            }`}
          >
            <div className={`chat-bubble ${
              String(msg.sender._id || msg.sender) === String(doctorId) ? "doctor" : "patient"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};