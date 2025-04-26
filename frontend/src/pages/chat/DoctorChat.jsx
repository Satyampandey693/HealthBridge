import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DoctorChat.css";
import { io } from "socket.io-client";
import { useAuth } from "../../store/auth";

const ENDPOINTS = "http://localhost:5000";
let socket;

export const DoctorChat = () => {
  const doctorId = localStorage.getItem("userID");
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const {authorizationToken}=useAuth();

  const doctor = {
    _id: doctorId,
  };

  useEffect(() => {
    socket = io(ENDPOINTS);
    socket.emit("setup", doctor);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageReceived) => {
      if (!activePatient || activePatient._id !== newMessageReceived.chat._id) {
        toast.info("New message from patient");
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.off("message recieved");
    socket.on("message recieved", handleMessageReceived);

    return () => {
      socket.off("message recieved", handleMessageReceived);
    };
  }, [activePatient]);

  useEffect(() => {
    if (activePatient) {
      fetchMessages(activePatient._id);
    }
  }, [activePatient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers:{
          Authorization:authorizationToken
        },
        withCredentials: true,
      });
      setPatients(
        data.map((chat) => ({
          _id: chat._id,
          name: chat.users.find((u) => u._id !== doctorId)?.name,
          userInfo: chat.users.find((u) => u._id !== doctorId),
        }))
      );
    } catch (error) {
      toast.error("Failed to load chats");
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await axios.get(`/api/message/${chatId}`, {
        headers:{
          Authorization:authorizationToken
        },
        withCredentials: true,
      });
      setMessages(data);
      socket.emit("join chat", chatId);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const openChat = (patient) => {
    setActivePatient(patient);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activePatient) return;

    const messageData = {
      content: newMessage,
      chatId: activePatient._id,
      senderId: doctorId,
      role: "doctor",
    };

    try {
      const { data } = await axios.post("/api/message", messageData, {
        headers:{
          Authorization:authorizationToken
        },
        withCredentials: true,
      });
      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const removePatient = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        const { data } = await axios.get(`/api/chat`, {
          headers:{
            Authorization:authorizationToken
          },
          withCredentials: true,
        });
        // console.log(data);
       const ndata=data.filter((p)=>p._id==id);
      //  console.log(ndata);
       const user=ndata[0].users.filter((p)=>p._id!=doctorId);
       const chatid=ndata[0]._id;
       const d={
        user:user,
        chatid:chatid
       }
       console.log(d);
        // console.log("zsdfgsasdadfdfhew cxhdw")
        // console.log(data);
        // if(data){
          socket.emit("delete chat",d);
          await axios.delete(`/api/chat/${id}`, {
            headers:{
              Authorization:authorizationToken
            },
            withCredentials: true,
          });
          setPatients((prev) => prev.filter((p) => p._id !== id));
          toast.success(`${name} has been removed`);
  
          if (activePatient && activePatient._id === id) {
            setActivePatient(null);
            setMessages([]);
          }
        // }
       
       

      } catch (error) {
        toast.error("Failed to remove chat from backend");
      }
    }
  };

  return (
    <div className="doctor-chat-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="patients-list">
        <h2>Patients</h2>
        {patients.map((patient) => (
          <div
            key={patient._id}
            className={`patient-item ${
              activePatient?._id === patient._id ? "active" : ""
            }`}
            onClick={() => openChat(patient)}
          >
            {patient.name}
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removePatient(patient._id, patient.name);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="chat-area">
        {activePatient ? (
          <>
            <div className="chat-header">Chat with {activePatient.name}</div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble-wrapper ${
                    String(msg.sender._id) === String(doctorId) ? "right" : "left"
                  }`}
                >
                  <div
                    className={`chat-bubble ${
                      String(msg.sender._id) === String(doctorId) ? "doctor" : "patient"
                    }`}
                  >
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
          </>
        ) : (
          <div className="no-chat">Select a patient to start chat</div>
        )}
      </div>
    </div>
  );
};