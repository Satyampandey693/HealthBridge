import PropTypes from "prop-types";
import "./NotificationDropdown.css";
import api from "../api/client.js";
import { useAuth } from "../store/auth";

const NotificationDropdown = ({ notifications, fetchNotifications }) => {
  const { userID: doctorId } = useAuth();

  const handleAccept = async (patient) => {
    try {
      await api.post("/api/doctor/add-patient", {
        doctorId,
        patientId: patient.patientId,
      });
      await api.post("/api/doctor/remove-notification", {
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
      await api.post("/api/doctor/remove-notification", {
        doctorId,
        patientId: patient.patientId,
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error declining patient:", err);
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown__head">Patient Requests</div>

      {!notifications || notifications.length === 0 ? (
        <div className="notification-empty">
          <span role="img" aria-label="bell">🔔</span>
          <p>No new requests</p>
        </div>
      ) : (
        notifications.map((patient, index) => (
          <div key={index} className="notification-item">
            <div className="notification-item__avatar">
              {patient.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span className="notification-item__name">{patient.name}</span>
            <div className="actions">
              <button className="btn-approve" onClick={() => handleAccept(patient)}>
                Approve
              </button>
              <button className="btn-decline" onClick={() => handleDecline(patient)}>
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

NotificationDropdown.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      patientId: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  fetchNotifications: PropTypes.func.isRequired,
};

export default NotificationDropdown;
