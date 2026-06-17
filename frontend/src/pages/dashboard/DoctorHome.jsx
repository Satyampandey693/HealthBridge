import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaClock, FaCloudUploadAlt, FaUserMd, FaStar } from "react-icons/fa";
import api from "../../api/client.js";
import "./Dashboard.css";

const actions = [
  { to: "/patients", icon: <FaUsers />, title: "My Patients", desc: "View patients and chat with them." },
  { to: "/slots", icon: <FaClock />, title: "Manage Slots", desc: "Add and manage your availability.", accent: true },
  { to: "/upload", icon: <FaCloudUploadAlt />, title: "Upload Report", desc: "Share lab results with a patient." },
  { to: "/doctor/profile", icon: <FaUserMd />, title: "My Profile", desc: "View and manage your profile.", accent: true },
];

export const DoctorHome = () => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    api.get("/api/doctor/me").then(({ data }) => setDoctor(data.user)).catch(() => {});
  }, []);

  return (
    <div className="dash hb-container">
      <div className="dash-hero">
        <h1>Welcome, Dr. {doctor?.name || ""} 🩺</h1>
        <p>
          {doctor?.specialization ? `${doctor.specialization} · ` : ""}
          {doctor?.numOfReviews
            ? `${doctor.rating?.toFixed(1)}★ from ${doctor.numOfReviews} reviews`
            : "Manage your patients, slots and reports."}
        </p>
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
        {doctor?.numOfReviews > 0 && (
          <div className="dash-action hb-card">
            <div className="dash-action__icon"><FaStar /></div>
            <h3>{doctor.rating?.toFixed(1)} / 5</h3>
            <p>Average rating from {doctor.numOfReviews} patient reviews</p>
          </div>
        )}
      </div>
    </div>
  );
};
