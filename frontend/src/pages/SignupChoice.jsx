import { Link } from "react-router-dom";
import "./SignupChoice.css";
import {Loader} from "../components/Loader"
import { useState} from "react";
import { useNavigate } from "react-router-dom";

export const SignupChoice = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };
   return (
      <div className="signup-choice-container">
        {loading ? (
          <Loader /> 
        ) : (
          <>
            <h1>Login As</h1>
            <p>Choose your role to login</p>
            <div className="buttons-container">
              <button className="signup-btn" onClick={() => handleNavigation("/userRegister")}>Signup as Patient</button>
              <button className="signup-btn" onClick={() => handleNavigation("/doctor/signup")}>Signup as Doctor</button>
              <button className="signup-btn" onClick={() => handleNavigation("/lab/signup")}>Signup as Lab</button>
            </div>
          </>
        )}
      </div>
    );
};

