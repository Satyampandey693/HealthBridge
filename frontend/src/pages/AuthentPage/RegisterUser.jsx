import { useState } from "react";
import { useNavigate ,NavLink} from "react-router-dom";
import { registerUser } from "../../Api/userApi.js";
import { Toaster, toast } from "react-hot-toast";
import "./userRegister.css"

import { useAuth } from "../../store/auth.jsx";

export const RegisterUser = ()=> {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", age: "" });
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
      const response = await fetch("/api/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
        storeTokenInLS(data.token,data.userId,"patient");
        toast.success("Signup successful!");
        navigate("/doctors");
    } else {
        alert(`Error: ${data.message}`);
    }
    } catch (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="userRegister-container">
      <Toaster position="top-center" />
      <div className="userRegister-box">
        <h2 className="userRegister-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="userRegister-form">
          <input name="name" placeholder="Name" className="userRegister-input-field" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" className="userRegister-input-field" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="userRegister-input-field" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" className="userRegister-input-field" onChange={handleChange} required />
          <input name="age" type="number" placeholder="Age" className="userRegister-input-field" onChange={handleChange} required />
          <button type="submit" className="userRegister-button" disabled={loading}>{loading ? "Processing..." : "Sign Up"}</button>
        </form>
        <p className="userRegister-footer">Already have an account? <NavLink to="/userLogin" className="userRegister-link">Login</NavLink></p>
      </div>
    </div>
  );
}
