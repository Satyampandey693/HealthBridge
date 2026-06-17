import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaFileMedical, FaFlask, FaUser, FaPills, FaCalendarCheck } from "react-icons/fa";
import api from "../../api/client.js";
import "./Dashboard.css";

const actions = [
  { to: "/doctors", icon: <FaUserMd />, title: "Find a Doctor", desc: "Browse specialists and book a consultation." },
  { to: "/reports", icon: <FaFileMedical />, title: "My Reports", desc: "View and download your lab reports." },
  { to: "/lab-tests", icon: <FaFlask />, title: "Lab Tests", desc: "Explore and book diagnostic tests.", accent: true },
  { to: "/medicines", icon: <FaPills />, title: "Medicines", desc: "Order medicines and refills.", accent: true },
  { to: "/Lab", icon: <FaCalendarCheck />, title: "Lab Categories", desc: "Find labs near you by category." },
  { to: "/user/profile", icon: <FaUser />, title: "My Profile", desc: "View your personal health record.", accent: true },
];

export const PatientHome = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/api/me").then(({ data }) => setName(data.user?.name || "")).catch(() => {});
  }, []);

  return (
    <div className="dash hb-container">
      <div className="dash-hero">
        <h1>Welcome back{name ? `, ${name}` : ""} 👋</h1>
        <p>How are you feeling today? Manage your care all in one place.</p>
      </div>
      <div className="dash-grid">
        {actions.map((a) => (
          <Link key={a.title} to={a.to} className="dash-action hb-card">
            <div className={`dash-action__icon${a.accent ? " dash-action__icon--accent" : ""}`}>
              {a.icon}
            </div>
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
