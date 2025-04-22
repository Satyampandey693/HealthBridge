import React, { useState, useEffect, useRef } from "react";
import ReactStars from "react-rating-stars-component";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./userChat.css";
import { io } from "socket.io-client";

const ENDPOINTS = "http://localhost:5000";
let socket;

const DoctorInfo = () => (
  <div className="uc-doctor-info">
    <img src="/123.png" alt="Doctor" className="uc-doctor-photo" />
    <div className="uc-doctor-description">
      <h3>Dr. Jane Smith</h3>
      <p>Specialist in Cardiology with 10+ years of experience.</p>
    </div>
  </div>
);

const Reviews = () => {
  const reviewData = [
    { text: "Great doctor, very patient and kind.", rating: 5 },
    { text: "Helped me understand my condition better.", rating: 4 },
    { text: "Would definitely recommend to others.", rating: 5 },
    { text: "Satisfactory consultation.", rating: 3 },
    { text: "She is awesome!", rating: 5 },
  ];

  const averageRating =
    reviewData.reduce((sum, r) => sum + r.rating, 0) / reviewData.length;

  return (
    <div className="uc-reviews">
      <h4>Overall Rating</h4>
      <ReactStars
        count={5}
        value={averageRating}
        size={24}
        edit={false}
        activeColor="#ffd700"
      />
      <h4>Reviews</h4>
      <div className="uc-review-list">
        {reviewData.map((review, index) => (
          <div key={index} className="uc-review-item">
            <ReactStars
              count={5}
              value={review.rating}
              size={20}
              edit={false}
              activeColor="#ffd700"
            />
            <p>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentDetails = ({ onClose, onPay, selectedPlan }) => {
  const durations = {
    "1d": { label: "1 Day", price: 500 },
    "1w": { label: "1 Week", price: 1500 },
    "1m": { label: "1 Month", price: 4000 },
    "1y": { label: "1 Year", price: 10000 },
  };

  const { label, price } = durations[selectedPlan] || {};

  return (
    <div className="uc-payment-overlay">
      <div className="uc-payment-box">
        <h2>Payment Details</h2>
        <p><strong>Selected Duration:</strong> {label}</p>
        <p><strong>Amount to Pay:</strong> ₹{price}</p>
        <p><strong>Choose your payment method:</strong></p>
        <ul>
          <li>UPI</li>
          <li>Credit/Debit Card</li>
          <li>Net Banking</li>
        </ul>
        <button onClick={onPay}>Make Payment</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const Pricing = ({ onShowPaymentDetails }) => {
  const [selectedKey, setSelectedKey] = useState(null);
  const durations = [
    { key: "1d", label: "1 Day", price: 500 },
    { key: "1w", label: "1 Week", price: 1500 },
    { key: "1m", label: "1 Month", price: 4000 },
    { key: "1y", label: "1 Year", price: 10000 },
  ];

  return (
    <div className="uc-pricing">
      <h3>Consultation Info</h3>
      <p><strong>Fees:</strong> ₹{selectedKey ? durations.find(d => d.key === selectedKey).price : '---'}</p>
      <p><strong>Duration:</strong> {selectedKey ? durations.find(d => d.key === selectedKey).label : '---'}</p>

      <h4>Select Duration</h4>
      <ul className="uc-duration-options">
        {durations.map(({ key, label, price }) => (
          <li
            key={key}
            onClick={() => setSelectedKey(key)}
            className={selectedKey === key ? "uc-selected" : ""}
          >
            {label} - ₹{price}
          </li>
        ))}
      </ul>

      <button onClick={() => onShowPaymentDetails(selectedKey)} disabled={!selectedKey}>Make Payment</button>
    </div>
  );
};

const Chat = ({ messages, onSend }) => {
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);
    const userId = localStorage.getItem("userID");
  console.log(userId);
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const handleSend = () => {
      if (input.trim() !== "") {
        onSend(input);
        setInput("");
      }
    };
    console.log(messages);
  
    return (
      <div className="uc-chat-section uc-chat-full">
        <h3>Chat with Dr. Jane Smith</h3>
        <div className="uc-chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`uc-chat-bubble-wrapper ${msg.sender._id === userId ? 'right' : 'left'}`}
            >
              <div
                className={`uc-chat-bubble ${msg.sender._id === userId ? 'patient' : 'doctor'}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <input
          type="text"
          placeholder="Type your message..."
          className="uc-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>
    );
  };
  

export const UserChat = () => {
  const userId = localStorage.getItem("userID");
  const [paid, setPaid] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const { dcId } = useParams();
  const user = { _id: userId };

  useEffect(() => {
    socket = io(ENDPOINTS);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageReceived) => {
      if (!chatId || chatId !== newMessageReceived.chat._id) {
        // Optional: Notify user
      } else {
        setMessages(prevMessages => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message recieved");
    };
  }, [chatId]);


  useEffect(()=>{
    socket.on('end chat',(chat_id)=>{//it may produce wrong animation
        // console.log("h");
        if(chatId==chat_id)
        setPaid(false);
    })
  })
  

  const handlePayment = async () => {
    try {
       
      const doctorId = dcId||"680629ac6b5fe7a1327bc68f";
      console.log(dcId,doctorId)
      const { data } = await axios.post(
        "/api/chat",
        { userId: doctorId, role: "patient" },
        { withCredentials: true }
      );

      setMessages(data.messages || []);
      setChatId(data._id);

      socket.emit("join chat", data._id);
      setPaid(true);
      setShowDetails(false);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      const { data } = await axios.post(
        "/api/message",
        {
          chatId,
          content,
          senderId: userId,
          role: "patient",
        },
        { withCredentials: true }
      );
      console.log(data);
      socket.emit("new message", data);
      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="uc-container">
      {showDetails && (
        <PaymentDetails
          onClose={() => setShowDetails(false)}
          onPay={handlePayment}
        />
      )}

      <div className="uc-left-section">
        <div className="uc-upper-left">
          <DoctorInfo />
        </div>
        <div className="uc-lower-left">
          <Reviews />
        </div>
      </div>

      <div className="uc-right-section">
        {!paid ? (
          <Pricing onShowPaymentDetails={() => setShowDetails(true)} />
        ) : (
          <Chat messages={messages} onSend={handleSendMessage} />
        )}
      </div>
    </div>
  );
};

