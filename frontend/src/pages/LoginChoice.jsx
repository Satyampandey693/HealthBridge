import { Link } from "react-router-dom";
import "./LoginChoice.css"; // Add your custom CSS for styling
import {Loader} from "../components/Loader"
import { useState} from "react";
import { useNavigate } from "react-router-dom";

export const LoginChoice = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 500);
  };
  return (
    <div className="login-choice-container">
      {loading ? (
        <Loader /> 
      ) : (
        <>
          <h1>Login As</h1>
          <p>Choose your role to login</p>
          <div className="buttons-container">
            <button className="login-btn" onClick={() => handleNavigation("/userlogin")}>Login as Patient</button>
            <button className="login-btn" onClick={() => handleNavigation("/doctor/login")}>Login as Doctor</button>
            <button className="login-btn" onClick={() => handleNavigation("/lab/login")}>Login as Lab</button>
          </div>
        </>
      )}
    </div>
  );
};
