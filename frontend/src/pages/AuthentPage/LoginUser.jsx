import { useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./userLogin.css"
import { useAuth } from "../../store/auth.jsx";
import api from "../../api/client.js";

export const LoginUser= () =>{
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const {storeTokenInLS}=useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/loginUser", formData);
      storeTokenInLS(data.token, data.userId, "patient");
      toast.success("Login successful!");
      navigate("/doctors");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="userLogin-container">
      <Toaster position="top-center" />
      <div className="userLogin-box">
        <h2 className="userLogin-title">Login</h2>
        <form onSubmit={handleSubmit} className="userLogin-form">
          <input name="email" type="email" placeholder="Email" className="userLogin-input-field" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="userLogin-input-field" onChange={handleChange} required />
          <button type="submit" className="userLogin-button" disabled={loading}>{loading ? "Processing..." : "Login"}</button>
        </form>
        <p className="userLogin-footer">Don't have an account? <NavLink to="/userRegister" className="userLogin-link">Sign Up</NavLink></p>
      </div>
    </div>
  );
}