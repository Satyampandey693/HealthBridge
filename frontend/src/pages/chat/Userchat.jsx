import React, { useState, useEffect, useRef } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./userChat.css";
import { toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import { useAuth } from "../../store/auth";

const ENDPOINTS = "http://localhost:5000";
let socket;

const DoctorInfo = ({ doctorInfo }) => (
  <div className="uc-doctor-info">
    <img src={"/123.png"} alt="Doctor" className="uc-doctor-photo" />
    <div className="uc-doctor-description">
      <h3>Dr. {doctorInfo?.name || ""}</h3>
      <p>{doctorInfo?.specialization || ""} with {doctorIn fo?.experience || ""}+ years of experience.</p>
    </div>
  </div>
);

const Reviews = ({ reviews }) => {
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;
  return (
    <div className="uc-reviews">
      <h4>Overall Rating</h4>
      <ReactStars count={5} value={averageRating} size={24} edit={false} activeColor="#ffd700" />
      <h4>Reviews</h4>
      <div className="uc-review-list">
        {reviews.map((review, index) => (
          <div key={index} className="uc-review-item">
            <ReactStars count={5} value={review.rating} size={20} edit={false} activeColor="#ffd700" />
            <p>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SlotSelection = ({ slots, onBookSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const availableSlots = slots.filter(slot => {
    const now = new Date();
    ////const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Skip booked slots or slots not for today
    if (slot.isBooked) return false;

    const [fromHour, fromMin] = slot.from.split(":").map(Number);
    const slotStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), fromHour, fromMin);

    return slotStartTime > now;
  });

  return (
    <div className="uc-pricing">
      <h3>Available Slots</h3>
      {availableSlots.length === 0 ? (
        <p>No Slots Available</p>
      ) : (
        <ul className="uc-duration-options">
          {availableSlots.map((slot, index) => (
            <li
              key={index}
              onClick={() => setSelectedSlot(slot)}
              className={selectedSlot === slot ? "uc-selected" : ""}
            >
              {slot.from} - {slot.to}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => onBookSlot(selectedSlot)} disabled={!selectedSlot}>
        Book Slot & Pay
      </button>
    </div>
  );
};

const Chat = ({ messages, onSend, doctorInfo }) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="uc-chat-section uc-chat-full">
      <h3>Chat with Dr. {doctorInfo?.name}</h3>
      <div className="uc-chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`uc-chat-bubble-wrapper ${msg.sender._id === userId ? 'right' : 'left'}`}
          >
            <div className={`uc-chat-bubble ${msg.sender._id === userId ? 'patient' : 'doctor'}`}>
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
  const location = useLocation();
  const userId = localStorage.getItem("userID");
  const [paid, setPaid] = useState(false);
  const [messages, setMessages] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const doctorIdRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);
  const { authorizationToken } = useAuth();
  const chatIdRef = useRef(null);
  const user = { _id: userId };

  useEffect(() => {
    socket = io(ENDPOINTS);
    socket.emit("setup", user);
    socket.on("connected", () => console.log("Socket connected"));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (chatIdRef.current === newMessage.chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    socket.on("end chat", (chat_id) => {
      if (chatIdRef.current === chat_id) setPaid(false);
    });
    return () => {
      socket.off("message recieved");
      socket.off("end chat");
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    const fetchDoctorInfo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/doctor/${id}`, {
          headers: { Authorization: authorizationToken },
        });
        setDoctorInfo(data);
        doctorIdRef.current = data._id;
        setReviews(data.reviews || []);
        setSlots(data.slots || []);
        console.log
        checkPaymentStatus(data._id);
      } catch (error) {
        console.error("Failed to fetch doctor info:", error);
      }
    };
    if (id) fetchDoctorInfo();
  }, [location.search, authorizationToken]);

  const checkPaymentStatus = async (doctorId) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/status",
        { userId, doctorId },
        {
          headers: { Authorization: authorizationToken },
          withCredentials: true,
        }
      );
      if (data.allowed) {
        setPaid(true);
        await initiateChatAfterVerification();
        await fetchMessages();
      } else {
        setPaid(false);
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
      setPaid(false);
    }
  };

  const initiateChatAfterVerification = async () => {
    try {
      const { data } = await axios.post(
        "/api/chat",
        { userId: doctorIdRef.current, role: "patient" },
        {
          headers: {
            Authorization: authorizationToken,
          },
          withCredentials: true,
        }
      );
      setMessages(data.messages || []);
      chatIdRef.current = data._id;
      socket.emit("join chat", chatIdRef.current);
    } catch (err) {
      console.error("Error setting up chat after verification:", err);
    }
  };

  const CheckoutHandler = async (slot) => {
    try {
      const { data: { key: razorKey } } = await axios.get("http://localhost:5000/api/getkey");
      const { data: { order } } = await axios.post("http://localhost:5000/api/payment/checkout", { amount: doctorInfo.fee });
      const doctorId = doctorIdRef.current;
      console.log(order);
      const options = {
        key: razorKey,
        amount: order.amount,
        currency: "INR",
        name: "HealthBridge",
        description: "Consultation Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verification = await axios.post(
              "http://localhost:5000/api/payment/verification",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: authorizationToken,
                },
                withCredentials: true,
              }
            );
  
            if (verification.data.success) {
              // 1. Store payment info
              await axios.post(
                "http://localhost:5000/api/payment/store",
                { userId, doctorId, slot },
                {
                  headers: {
                    Authorization: authorizationToken,
                  },
                  withCredentials: true,
                }
              );
              console.log("hello man");
              // 2. Update slot to isBooked = true
              await axios.put(
                "http://localhost:5000/api/doctor/slot/update",
                {
                  doctorId,
                  slotId: slot._id,
                  isBooked: true,
                },
                {
                  headers: {
                    Authorization: authorizationToken,
                  },
                  withCredentials: true,
                }
              );

              // 3. Handle post-payment actions
              handlePayment();
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Something went wrong after payment.");
            console.error("Payment process error:", err);
          }
        },
        prefill: {
          name: "Patient",
          email: "patient@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#121212"
        }
      };
  
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("CheckoutHandler error:", err);
    }
  };
  
  const handlePayment = async () => {
    await initiateChatAfterVerification();
    setPaid(true);
    await fetchMessages();
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`/api/message/${chatIdRef.current}`, {
        headers: {
          Authorization: authorizationToken
        },
        withCredentials: true,
      });
      setMessages(data);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (content) => {
    try {
      const { data } = await axios.post(
        "/api/message",
        {
          chatId: chatIdRef.current,
          content,
          senderId: userId,
          role: "patient",
        },
        {
          headers: {
            Authorization: authorizationToken,
          },
          withCredentials: true
        }
      );
      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="uc-container">
      <div className="uc-left-section">
        <div className="uc-upper-left">
          <DoctorInfo doctorInfo={doctorInfo} />
        </div>
        <div className="uc-lower-left">
          <Reviews reviews={reviews} />
        </div>
      </div>
      <div className="uc-right-section">
        {!paid ? (
          <SlotSelection slots={slots} onBookSlot={CheckoutHandler} />
        ) : (
          <Chat messages={messages} onSend={handleSendMessage} doctorInfo={doctorInfo || "Doctor"} />
        )}
      </div>
    </div>
  );
};
