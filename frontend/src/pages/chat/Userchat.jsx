import React, { useState, useEffect, useRef } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./userChat.css";
import { toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import { useAuth } from "../../store/auth";
import { useNotifications } from "../../store/notifications.jsx";
import { SOCKET_URL } from "../../config";
import api from "../../api/client.js";

const ENDPOINTS = SOCKET_URL;
let socket;

const DoctorInfo = ({ doctorInfo }) => {
  const initials = doctorInfo?.name?.charAt(0)?.toUpperCase() || "D";
  return (
    <div className="uc-doctor-info">
      <div className="uc-doctor-photo">
        {doctorInfo?.profilepic ? (
          <img src={doctorInfo.profilepic} alt={doctorInfo.name} />
        ) : (
          initials
        )}
      </div>
      <div className="uc-doctor-description">
        <h3>Dr. {doctorInfo?.name || ""}</h3>
        {doctorInfo?.specialization && (
          <span className="uc-doctor-spec">{doctorInfo.specialization}</span>
        )}
        <div className="uc-doctor-meta">
          {doctorInfo?.experience != null && <span>🩺 {doctorInfo.experience}+ yrs exp</span>}
          {doctorInfo?.city && <span>📍 {doctorInfo.city}</span>}
          {doctorInfo?.fee != null && <span>💳 ₹{doctorInfo.fee}</span>}
          {doctorInfo?.numOfReviews > 0 && (
            <span>⭐ {doctorInfo.rating?.toFixed(1)} ({doctorInfo.numOfReviews})</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Reviews = ({ reviews }) => {
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;
  return (
    <div className="uc-reviews">
      <h4>Overall Rating</h4>
      <div className="uc-rating-row">
        {/* key forces a remount when the average changes — react-rating-stars
            caches its initial value and otherwise won't update. */}
        <ReactStars
          key={`avg-${averageRating}`}
          count={5}
          value={averageRating}
          size={24}
          edit={false}
          isHalf
          activeColor="#ffd700"
        />
        <span className="uc-rating-number">
          {averageRating ? averageRating.toFixed(1) : "—"}
        </span>
      </div>
      <h4>Reviews ({reviews.length})</h4>
      <div className="uc-review-list">
        {reviews.length === 0 && <p className="uc-no-reviews">No reviews yet. Be the first!</p>}
        {reviews.map((review, index) => (
          <div key={index} className="uc-review-item">
            {review.name && <strong className="uc-review-name">{review.name}</strong>}
            <ReactStars
              key={`r-${index}-${review.rating}`}
              count={5}
              value={review.rating}
              size={18}
              edit={false}
              activeColor="#ffd700"
            />
            <p>{review.comment || review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Lets a patient who has consulted submit / update their star rating + comment.
const ReviewForm = ({ doctorId, onReviewed }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0); // bump to reset the star picker

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/doctor/${doctorId}/review`, { rating, comment });
      toast.success("Thanks for your review!");
      setComment("");
      setRating(0);
      setFormKey((k) => k + 1);
      onReviewed?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="uc-review-form" onSubmit={submit}>
      <h4>Rate your doctor</h4>
      <ReactStars
        key={formKey}
        count={5}
        value={rating}
        size={28}
        edit={true}
        activeColor="#ffd700"
        onChange={setRating}
      />
      <textarea
        className="uc-review-textarea"
        placeholder="Share your experience (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <button type="submit" className="hb-btn hb-btn-primary" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

const SlotSelection = ({ slots, onBookSlot, isLoggedIn }) => {
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
      {isLoggedIn ? (
        <button onClick={() => onBookSlot(selectedSlot)} disabled={!selectedSlot}>
          Book Slot & Pay
        </button>
      ) : (
        <>
          <p className="uc-login-note">Please log in as a patient to book a consultation.</p>
          <button onClick={() => onBookSlot(null)}>Log in to Book</button>
        </>
      )}
    </div>
  );
};

const Chat = ({ messages, onSend, doctorInfo }) => {
  const [input, setInput] = useState("");
  const chatWindowRef = useRef(null);
  const userId = localStorage.getItem("userID");

  // Scroll the chat box itself, not the whole page.
  useEffect(() => {
    const container = chatWindowRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
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
      <div className="uc-chat-window" ref={chatWindowRef}>
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
  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");
  const [paid, setPaid] = useState(false);
  const [messages, setMessages] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const doctorIdRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);
  const { authorizationToken, isLoggedIn } = useAuth();
  const { clearChat } = useNotifications();
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
        // Patient is reading this chat, so keep its notifications cleared.
        clearChat(chatIdRef.current);
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
        // Public endpoint — works whether or not the visitor is logged in.
        const { data } = await api.get(`/api/doctor/${id}`);
        setDoctorInfo(data);
        doctorIdRef.current = data._id;
        setReviews(data.reviews || []);
        setSlots(data.slots || []);
        // Payment status / chat are only relevant for logged-in patients.
        if (isLoggedIn) {
          checkPaymentStatus(data._id);
        } else {
          setPaid(false);
        }
      } catch (error) {
        console.error("Failed to fetch doctor info:", error);
      }
    };
    if (id) fetchDoctorInfo();
  }, [location.search, isLoggedIn]);

  // Re-pull the doctor (and its reviews) after the patient submits a review.
  const refreshReviews = async () => {
    const docId = doctorIdRef.current;
    if (!docId) return;
    try {
      const { data } = await api.get(`/api/doctor/${docId}`);
      setReviews(data.reviews || []);
      setDoctorInfo(data);
    } catch (err) {
      console.error("Failed to refresh reviews:", err);
    }
  };

  const checkPaymentStatus = async (doctorId) => {
    try {
      const { data } = await axios.post(
        "/api/payment/status",
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
        { userId: doctorIdRef.current, role: "doctor" },
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
      // Opening the chat means any waiting messages are now seen.
      clearChat(chatIdRef.current);
    } catch (err) {
      console.error("Error setting up chat after verification:", err);
    }
  };
const loadRazorpayScript = () => {
  return new Promise((resolve) => {

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
  const CheckoutHandler = async (slot) => {
    try {
      const doctorId = doctorIdRef.current;
      const { data: { key: razorKey } } = await axios.get("/api/getkey");
      const { data: { order } } = await axios.post(
        "/api/payment/checkout",
        { doctorId },
        { headers: { Authorization: authorizationToken }, withCredentials: true }
      );
      console.log(order);
      console.log(razorKey)
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
              "/api/payment/verification",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                doctorId,
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
                "/api/payment/store",
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
                "/api/doctor/slot/update",
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
              await axios.post(`/api/doctor/add/${doctorIdRef.current}/notifications`,
        { 
        patientId: userId
      },
        {
          headers: {
            Authorization: authorizationToken,
          },
          withCredentials: true,
        },
        
      );
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
          {paid && (
            <ReviewForm doctorId={doctorIdRef.current} onReviewed={refreshReviews} />
          )}
        </div>
      </div>
      <div className="uc-right-section">
        {!paid ? (
          <SlotSelection
            slots={slots}
            isLoggedIn={isLoggedIn}
            onBookSlot={isLoggedIn ? CheckoutHandler : () => navigate("/login")}
          />
        ) : (
          <Chat messages={messages} onSend={handleSendMessage} doctorInfo={doctorInfo || "Doctor"} />
        )}
      </div>
    </div>
  );
};