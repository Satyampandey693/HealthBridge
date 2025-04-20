import PropTypes from "prop-types";
import "./DocCard.css";

const DocCard = ({ name, city, experience, rating }) => {
  return (
    <div className="doctor-wrapper">
      <img
        src={"https://via.placeholder.com/150"}
        alt={name || "Doctor Image"}
        className="doctor-photo"
      />
      <div className="doctor-info-box">
        <h2 className="doctor-heading">👨‍⚕️ {name}</h2>
        <p className="doctor-detail">🩺 Experience: {experience || "N/A"} years</p>
        <p className="doctor-detail">📍 City: {city || "Unknown"}</p>
        <p className="doctor-detail">💰 Fees: ₹N/A</p>
        <p className="doctor-detail">⭐ Rating: {rating || "N/A"}/5</p>
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