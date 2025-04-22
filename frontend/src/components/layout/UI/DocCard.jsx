import PropTypes from "prop-types";
import "./DocCard.css";

const DocCard = ({ name, city, experience, rating }) => {
  return (
    <div className="doctor-card">
      <img
        src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
        alt={name || "Doctor"}
        className="doctor-image"
      />
      <div className="doctor-details">
        <h3 className="doctor-name">Dr. {name}</h3>
        <p>🩺 <strong>Experience:</strong> {experience || "N/A"} years</p>
        <p>📍 <strong>City:</strong> {city || "Unknown"}</p>
        <p>💰 <strong>Fees:</strong> ₹N/A</p>
        <p>⭐ <strong>Rating:</strong> {rating || "N/A"}/5</p>
      </div>
    </div>
  );
};

DocCard.propTypes = {
  name: PropTypes.string,
  experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  city: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DocCard;
