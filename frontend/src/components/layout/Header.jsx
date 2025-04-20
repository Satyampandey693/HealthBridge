import { Link } from "react-router-dom";
import "./Header.css";
import NotificationDropdown from "../../pages/NotificationDropdown";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";

export const Header = () => {
  const role = localStorage.getItem("role");
  const doctorId = localStorage.getItem("userID");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // 🔔 Fetch notifications for doctor
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/notifications/${doctorId}`);
      //console.log(res);
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (role === "doctor") {
      fetchNotifications();
      //console.log(notifications);
    }
  }, [role]);
 
  if (role === "patient") {
    return (
      <nav className="navbar">
        <div className="left-section">
          <div className="logo">
            <Link to="/">HealthBridge</Link>
          </div>
          <ul className="nav-links">
            <li><Link to="/doctors">Doctors</Link></li>
            <li><Link to="/medicines">Medicines</Link></li>
            <li><Link to="/lab-tests">Lab Tests</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>

        <div className="right-section">
          <Link to="/" className="auth-btn">Logout</Link>
        </div>
      </nav>
    );
  } else if (role === "doctor") {
    return (
      <nav className="navbar">
        <div className="left-section">
          <div className="logo">
            <Link to="/">HealthBridge</Link>
          </div>
          <ul className="nav-links">
            <li><Link to="/patients">Patients</Link></li>
          </ul>
        </div>

        <div className="right-section">
          <div className="notification-container">
            <div className="bell-wrapper" onClick={toggleDropdown}>
              <FaBell className="bell-icon" />
              {notifications&&notifications.length > 0 && (
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

          <Link to="/profile" className="profile-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
              alt="Profile"
              className="avatar"
            />
          </Link>
          <Link to="/login" className="auth-btn">Logout</Link>
        </div>
      </nav>
    );
  }
};
