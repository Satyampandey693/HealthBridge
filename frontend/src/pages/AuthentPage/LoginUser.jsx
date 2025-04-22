import { useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { loginUser } from "../../Api/userApi.js";
import { Toaster, toast } from "react-hot-toast";
import "./userLogin.css"
import { useAuth } from "../../store/auth.jsx";

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
        const response = await fetch("/api/loginUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            storeTokenInLS(data.token,data.userId,"patient");
            toast.success("Login successful!");
            navigate("/doctors");
        } else {
            alert(`Error: ${data.message}`);
        }
        console.log("h");
    } catch (error) {
      toast.error(error);
    }
    setLoading(false);
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