import { useState } from "react";
import "./DoctorSignup.css";

export const DoctorSignup = () => {
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        email: "",
        phone_no: "",
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

        try {
            const response = await fetch("/api/doctor/signup", {
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

    const specializations = [
        "Oncologist",
        "Neurologist",
        "Cardiologist",
        "Physician",
        "Dentist",
        "Child Specialist",
        "Dermatologist",
        "Radiologist",
        "Gastroenterologist",
        "Endocrinologist",
        "Psychiatrist",
        "Geriatrician",
        "Nephrologist",
        "Orthopaedist",
        "Allergist",
        "Hematologist",
        "Internist",
        "Gynaecologist",
        "Ophthalmologist",
        "Anesthesiologist",
        "Pulmonologist",
    ];

    return (
        <div className="signup-container">
            <h2>Doctor Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
                <input type="date" name="dob" required onChange={handleChange} />
                <input type="email" name="email" placeholder="Email ID" required onChange={handleChange} />
                <input type="tel" name="phone_no" placeholder="Phone Number" required onChange={handleChange} />
                
                {/* Specialization dropdown */}
                <select name="specialization" required onChange={handleChange}>
                    <option value="">Select Specialization</option>
                    {specializations.map((specialization, index) => (
                        <option key={index} value={specialization}>
                            {specialization}
                        </option>
                    ))}
                </select>
                
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
