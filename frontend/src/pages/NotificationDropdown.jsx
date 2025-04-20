import PropTypes from "prop-types";
import "./NotificationDropdown.css";
import axios from "axios";

const NotificationDropdown = ({ notifications, fetchNotifications }) => {
  const doctorId = localStorage.getItem("userID");

  const handleAccept = async (patient) => {
    try {
      await axios.post("http://localhost:5000/api/doctor/add-patient", {
        doctorId,
        patientId: patient.patientId,
        // patientName: patient.name,
      });
      await axios.post("http://localhost:5000/api/doctor/remove-notification", {
        doctorId,
        patientId: patient.patientId,
      });

      fetchNotifications();
    } catch (err) {
      console.error("Error adding patient:", err);
    }
  };

  const handleDecline = async (patient) => {
    try {
      await axios.post("http://localhost:5000/api/doctor/remove-notification", {
        doctorId,
        patientId: patient.patientId,
      });
      
      fetchNotifications();
    } catch (err) {
      console.error("Error adding patient:", err);
    }
  };

  return (
    <div className="notification-dropdown">
      {notifications&&notifications.map((patient, index) => (
        <div key={index} className="notification-item">
          <span>{patient.name}</span>
          <div className="actions">
            <button onClick={() => handleAccept(patient)}>Approve</button>
            <button onClick={() => handleDecline(patient)}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ✅ Add PropTypes
NotificationDropdown.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  fetchPatients: PropTypes.func.isRequired,
};

export default NotificationDropdown;
