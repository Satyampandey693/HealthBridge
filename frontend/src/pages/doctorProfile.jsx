import React, { useEffect, useState } from "react";
import axios from "axios";
import "./doctorProfile.css";

export const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/doctor/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Error accessing practitioner data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  if (loading) return <div className="profile-status">Syncing medical records...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="profile-wrapper doctor-portal">
      <header className="profile-header doctor-brand">
        <div className="header-text">
          <h1 className="main-title">Practitioner Dashboard</h1>
          <p className="subtitle">Verified Medical Professional</p>
        </div>
        <div className="exp-badge">
          <span className="exp-number">{doctor?.experience}+</span>
          <span className="exp-text">Years Exp.</span>
        </div>
      </header>

      <section className="profile-content">
        <h2 className="section-label">Professional Identity</h2>
        <div className="details-list">
          <div className="detail-row">
            <span className="attribute">Doctor Name</span>
            <span className="value">Dr. {doctor?.name}</span>
          </div>
          <div className="detail-row">
            <span className="attribute">Official Email</span>
            <span className="value">{doctor?.email}</span>
          </div>
          <div className="detail-row">
            <span className="attribute">Contact Number</span>
            <span className="value">{doctor?.phone_no}</span>
          </div>
        </div>
      </section>

    </div>
  );
};