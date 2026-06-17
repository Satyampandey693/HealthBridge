import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import api from "../api/client.js";
import { Loader } from "../components/Loader.jsx";
import "./Profile.css";

export const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const { data } = await api.get("/api/doctor/me");
        setDoctor(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Error accessing practitioner data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    setUploading(true);
    try {
      const { data } = await api.put("/api/doctor/me/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDoctor((d) => ({ ...d, profilepic: data.profilepic }));
      window.dispatchEvent(new Event("avatar-updated"));
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-msg">{error}</div>;

  const initials = doctor?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="profile-page hb-container">
      <div className="profile-card hb-card">
        <div className="profile-banner profile-banner--doctor">
          <div className="profile-avatar">
            {doctor?.profilepic ? (
              <img src={doctor.profilepic} alt={doctor.name} />
            ) : (
              initials
            )}
            <label className="profile-avatar__edit" title="Change photo">
              <FaCamera />
              <input type="file" accept="image/*" hidden onChange={handleAvatar} disabled={uploading} />
            </label>
          </div>
        </div>
        <div className="profile-body">
          <h1 className="profile-name">Dr. {doctor?.name}</h1>
          <span className="profile-role-badge">{doctor?.specialization || "Doctor"}</span>

          <div className="profile-details">
            <div className="profile-field">
              <span>Email</span>
              <strong>{doctor?.email}</strong>
            </div>
            <div className="profile-field">
              <span>Phone</span>
              <strong>{doctor?.phone_no || "—"}</strong>
            </div>
            <div className="profile-field">
              <span>Experience</span>
              <strong>{doctor?.experience != null ? `${doctor.experience} years` : "—"}</strong>
            </div>
            <div className="profile-field">
              <span>City</span>
              <strong>{doctor?.city || "—"}</strong>
            </div>
            <div className="profile-field">
              <span>Consultation Fee</span>
              <strong>{doctor?.fee != null ? `₹${doctor.fee}` : "—"}</strong>
            </div>
            <div className="profile-field">
              <span>Rating</span>
              <strong>
                {doctor?.numOfReviews
                  ? `${doctor.rating?.toFixed(1)}★ (${doctor.numOfReviews})`
                  : "No reviews yet"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
