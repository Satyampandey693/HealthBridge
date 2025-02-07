import { Link } from "react-router-dom";
import "./Header.css";

export const Header = () => {
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
        <Link to="/login" className="auth-btn">Login</Link>
        <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
};
