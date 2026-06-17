import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import api from "../api/client.js";
import { Loader } from "../components/Loader.jsx";
import "./Profile.css";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/me");
        setUser(data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    setUploading(true);
    try {
      const { data } = await api.put("/api/me/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((u) => ({ ...u, profilePicture: data.profilePicture }));
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

  const initials = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="profile-page hb-container">
      <div className="profile-card hb-card">
        <div className="profile-banner">
          <div className="profile-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} />
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
          <h1 className="profile-name">{user?.name}</h1>
          <span className="profile-role-badge">Patient</span>

          <div className="profile-details">
            <div className="profile-field">
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="profile-field">
              <span>Phone</span>
              <strong>{user?.phone || "—"}</strong>
            </div>
            <div className="profile-field">
              <span>Age</span>
              <strong>{user?.age ?? "—"}</strong>
            </div>
            <div className="profile-field">
              <span>Member Since</span>
              <strong>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
