import { useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { loginUser } from "../../Api/userApi.js";
import { Toaster, toast } from "react-hot-toast";
import "./userLogin.css"
export const LoginUser= () =>{
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(formData);
      toast.success("Login successful!");
      navigate("/");
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