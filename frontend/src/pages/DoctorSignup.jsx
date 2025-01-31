import { useState } from "react";
import "./DoctorSignup.css"; // Import the CSS file

export const DoctorSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        email: "",
        phone: "",
        specialization: "",
        city: "",
        experience: "",
        gender: "",
        fee: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);

        // API call to backend
        try {
            const response = await fetch("/api/doctors/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup successful!");
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Signup failed. Try again.");
        }
    };

    return (
        <div className="signup-container">
            <h2>Doctor Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
                <input type="date" name="dob" required onChange={handleChange} />
                <input type="email" name="email" placeholder="Email ID" required onChange={handleChange} />
                <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} />
                <input type="text" name="specialization" placeholder="Specialization" required onChange={handleChange} />
                <input type="text" name="city" placeholder="City" required onChange={handleChange} />
                <input type="number" name="experience" placeholder="Experience (Years)" required onChange={handleChange} />
                
                <select name="gender" required onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <input type="number" name="fee" placeholder="Consultancy Fee" required onChange={handleChange} />
                <input type="password" name="password" placeholder="Create Password" required onChange={handleChange} />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};
