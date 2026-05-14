import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPatients.css';
import { useAuth } from '../store/auth';
import { DoctorChat } from './chat/DoctorChat'; // Import the sibling component

export const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { authorizationToken } = useAuth();
  const doctorId = localStorage.getItem('userID');

  // Fetch the list of patients associated with this doctor
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/${doctorId}/patients`, {
        headers: {
          Authorization: authorizationToken,
        },
        withCredentials: true,
      });
     console.log("Fetched Data:", res.data.patients); // CHECK: does 'chatId' exist here now?
    setPatients(res.data.patients);
  } catch (err) {
    console.error(err);
  }
  };

  useEffect(() => {
    if (doctorId) fetchPatients();
  }, [doctorId]);

  // Handle removing a patient from the list
  const handleRemovePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to remove this patient?")) return;
    
    try {
      const res = await axios.put(`http://localhost:5000/api/doctor/${doctorId}/remove-patient`, 
        { patientId },
        { 
          headers: { Authorization: authorizationToken },
          withCredentials: true 
        }
      );
      
      // Update local state with the new list returned from backend
      setPatients(res.data.patients);
      
      // If the removed patient was the one we were chatting with, close the chat
      if (selectedPatient && selectedPatient.patientId === patientId) {
        setSelectedPatient(null);
      }
    } catch (err) {
      console.error('Error removing patient:', err);
    }
  };

  return (
    <div className="chat-container">
      {patients.length === 0 ? (
        <div className="no-patients">
          <h2>No Patients</h2>
        </div>
      ) : (
        <div className="chat-wrapper">
          {/* LEFT SIDEBAR: Patient List */}
          <div className="sidebar">
            <h3>Patients</h3>
            <ul>
              {patients.map((patient) => (
                <li
                  key={patient.patientId}
                  className={selectedPatient?.patientId === patient.patientId ? 'active' : ''}
                >
                  <span onClick={() => setSelectedPatient(patient)}>
                    {patient.name}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent clicking the li
                      handleRemovePatient(patient.patientId);
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE: Conditional Rendering of Chat */}
          <div className="chat-window">
            {selectedPatient ? (
              // We pass the patient details as props to DoctorChat
              <DoctorChat 
                activePatientId={selectedPatient.patientId} 
  activeChatId={selectedPatient.chatId} // NEW PROP
  activePatientName={selectedPatient.name}
              />
            ) : (
              <div className="no-chat-selected">
                <h2>Select a patient to start chatting</h2>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};