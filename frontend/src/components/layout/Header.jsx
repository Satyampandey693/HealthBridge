import "./Header.css";
import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <NavLink to="/doctors" className={({ isActive }) => isActive ? "active" : ""}>
          Doctors
        </NavLink>
        <NavLink to="/medicines" className={({ isActive }) => isActive ? "active" : ""}>
          Medicines
        </NavLink>
        <NavLink to="/labtests" className={({ isActive }) => isActive ? "active" : ""}>
          Lab Tests
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>
          Reports
        </NavLink>
      </div>
      
      <div className="navbar-right">
        <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
          My Profile
        </NavLink>
      </div>
    </div>
  );
};
