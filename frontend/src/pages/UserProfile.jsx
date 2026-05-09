import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
       const token = localStorage.getItem("token");

const { data } = await axios.get("http://localhost:5000/api/me", {
  headers: { 
    Authorization: `Bearer ${token}` 
  },
});
       console.log(data)
        setUser(data.user);
        //console.log(user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loader">Loading Profile...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
  <div className="profile-wrapper">
    <header className="profile-header user-brand">
      <div className="header-text">
        <h1 className="main-title">Patient Profile</h1>
        <p className="subtitle">Personal Health Record</p>
      </div>
      {/* User specific badge */}
    </header>

    <section className="profile-content">
      <h2 className="section-label">General Information</h2>
      <div className="details-list">
        <div className="detail-row">
          <span className="attribute">Full Name</span>
          <span className="value">{user?.name}</span>
        </div>
        <div className="detail-row">
          <span className="attribute">Email Address</span>
          <span className="value">{user?.email}</span>
        </div>
        <div className="detail-row">
          <span className="attribute">Phone Number</span>
          <span className="value">{user?.phone}</span>
        </div>
      </div>
    </section>

  </div>
);
};