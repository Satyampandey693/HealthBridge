import PropTypes from "prop-types";
import "./DocCard.css";

export const DocCard = ({ photoUrl, name, fees, rating, experience,city }) => {
  return (
    <div className="doctor-card">
      <img
        src={photoUrl || "https://via.placeholder.com/150"}
        alt={name || "Doctor Image"}
        className="doctor-card-image"
      />
      <div className="doctor-card-content">
        <h2 className="doctor-card-title">{name}</h2>
        <p className="doctor-card-info">🩺 Experience:{experience || "N/A"} years</p>
        <p className="doctor-card-info">📍 Location:{city || "Unknown Location"}</p>
        <p className="doctor-card-info">💰 Consultancy Fees: ₹{fees || "N/A"}</p>
        <p className="doctor-card-info">⭐ Rating: {rating || "N/A"}/5</p>
      </div>
    </div>
  );
};

DocCard.propTypes = {
  doctorName: PropTypes.string,
  photoUrl: PropTypes.string,
  experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fees: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  city: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

