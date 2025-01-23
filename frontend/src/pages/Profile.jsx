// Profile.js
import  { useState } from "react";
import "./Profile.css";

export const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    phoneNumber: "+1234567890",
    email: "johndoe@example.com",
    dob: "1990-01-01",
    gender: "Male",
    bloodGroup: "O+",
    address: "123 Main Street, Anytown, USA",
  });

  const [tempProfileData, setTempProfileData] = useState({ ...profileData });
  const [profilePhoto, setProfilePhoto] = useState("default-photo.jpg");
  const [tempProfilePhoto, setTempProfilePhoto] = useState(profilePhoto);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfileData({ ...tempProfileData, [name]: value });
  };

  const updatePhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...tempProfileData });
    setProfilePhoto(tempProfilePhoto);
    alert("Profile changes saved!");
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-header">
          <input
            type="file"
            id="photoUpload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={updatePhoto}
          />
          <img
            id="profilePhoto"
            className="profile-photo"
            src={tempProfilePhoto}
            alt="Profile"
            onClick={() => document.getElementById("photoUpload").click()}
          />
          <input
            type="text"
            name="name"
            value={tempProfileData.name}
            onChange={handleInputChange}
            className="editable-input"
            placeholder="Enter your name"
          />
        </div>

        <div className="profile-details">
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={tempProfileData.phoneNumber}
              onChange={handleInputChange}
              className="editable-input"
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={tempProfileData.email}
              onChange={handleInputChange}
              className="editable-input"
            />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={tempProfileData.dob}
              onChange={handleInputChange}
              className="editable-input"
            />
          </div>
          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={tempProfileData.gender}
              onChange={handleInputChange}
              className="editable-input"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Blood Group:</label>
            <select
              name="bloodGroup"
              value={tempProfileData.bloodGroup}
              onChange={handleInputChange}
              className="editable-input"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div>
            <label>Address:</label>
            <textarea
              name="address"
              value={tempProfileData.address}
              onChange={handleInputChange}
              className="editable-input"
            />
          </div>
        </div>

        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};
