import { Link } from "react-router-dom";
import "./Header.css";
import NotificationDropdown from "../../pages/NotificationDropdown";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../store/auth";

export const Header = () => {
  const { isLoggedIn } = useAuth();
  const role = localStorage.getItem("role");
  const doctorId = localStorage.getItem("userID");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/notifications/${doctorId}`);
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (role === "doctor") {
      fetchNotifications();
    }
  }, [role]);

  const avatarURL =
    role === "doctor"
      ? "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      : role === "patient"
      ? "https://cdn-icons-png.flaticon.com/512/847/847969.png"
      : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"; // Generic for lab or default

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
              </>
            )}
          </ul>
        )}
      </div>

      <div className="right-section">
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

        {isLoggedIn ? (
          <>
            <Link to="/profile" className="profile-icon">
              <img
                src={avatarURL}
                alt="Profile"
                className="avatar"
              />
            </Link>
            <Link to="/logout" className="auth-btn">Logout</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-btn">Login</Link>
            <Link to="/signup" className="auth-btn">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};
