import { Link } from "react-router-dom";
import "./Header.css";
import NotificationDropdown from "../../pages/NotificationDropdown";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import api from "../../api/client.js";
import { useAuth } from "../../store/auth";

const PLACEHOLDER = {
  doctor: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
  patient: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
};

export const Header = () => {
  const { role, userID: doctorId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const toggleDropdown = () => setShowDropdown((s) => !s);

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
