import { useState } from "react";
import "./DoctorLogin.css";

export const DoctorLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login Data:", formData);

        try {
            const response = await fetch("/api/doctors/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Login successful!");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Login failed. Try again.");
        }
    };

    return (
        <div className="page-content">
        <div className="login-container">
            <h2>Doctor Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email ID" required onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
        </div>
    );
};
