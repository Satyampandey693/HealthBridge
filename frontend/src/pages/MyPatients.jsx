import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPatients.css';

export const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState('');

  const doctorId = localStorage.getItem('userID');

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/${doctorId}/patients`);
      setPatients(res.data.patients);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [doctorId]);

  const handleRemovePatient = async (patientId) => {
    try {
     const res= await axios.put(`http://localhost:5000/api/doctor/${doctorId}/remove-patient`, {
        patientId,
      });

      setPatients(res.data.patients);
      
      if (selectedPatient && selectedPatient.patientId === patientId) {
        setSelectedPatient(null);
      }
    } catch (err) {
      console.error('Error removing patient:', err);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedPatient) return;
    const newMsg = {
      text: messageInput,
      sender: 'doctor',
      timestamp: new Date(),
    };
    setMessages((prev) => {
      const patientMessages = prev[selectedPatient.patientId] || [];
      return { ...prev, [selectedPatient.patientId]: [...patientMessages, newMsg] };
    });
    setMessageInput('');
  };

  return (
    <div className="chat-container">
      {patients.length === 0 ? (
        <div className="no-patients">
          <h2>No Patients</h2>
        </div>
      ) : (
        <div className="chat-wrapper">
          <div className="sidebar">
            <h3>Patients</h3>
            <ul>
              {patients.map((patient) => (
                <li
                  key={patient.patientId}
                  className={selectedPatient && selectedPatient.patientId === patient.patientId ? 'active' : ''}
                >
                  <span onClick={() => setSelectedPatient(patient)}>{patient.name}</span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemovePatient(patient.patientId)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-window">
            {selectedPatient ? (
              <>
                <div className="chat-header">
                  <h2>Chat with {selectedPatient.name}</h2>
                </div>
                <div className="chat-messages">
                  {messages[selectedPatient.patientId] && messages[selectedPatient.patientId].length > 0 ? (
                    messages[selectedPatient.patientId].map((msg, index) => (
                      <div key={index} className={`chat-message ${msg.sender}`}>
                        <span>{msg.text}</span>
                        <div className="timestamp">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No messages yet.</p>
                  )}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </>
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
