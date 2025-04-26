import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import "./DoctorSlotManager.css";

export const DoctorSlotManager = () => {
  const { authorizationToken } = useAuth();
  const [slots, setSlots] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const userID = localStorage.getItem("userID");

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctor/slots/${userID}`, {
        headers: {
          Authorization: authorizationToken,
        },
      });
      setSlots(res.data.slots || []);
    } catch (error) {
      console.error("Error fetching slots", error);
    }
  };

  const createSlot = async () => {
    if (!from || !to) return alert("Please enter both from and to times.");
    try {
      await axios.post(
        `http://localhost:5000/api/doctor/add/${userID}`,
        { from, to },
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      setFrom("");
      setTo("");
      fetchSlots();
    } catch (error) {
      console.error("Error creating slot", error);
    }
  };

  const toggleBooking = async (slotId, currentStatus) => {
    try {
      await axios.put(
        "http://localhost:5000/api/doctor/slot/update",
        {
          doctorId: userID,
          slotId,
          isBooked: !currentStatus,
        },
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      fetchSlots();
    } catch (error) {
      console.error("Error updating booking status", error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="slot-manager-container">
      <h2>Manage Appointment Slots</h2>

      <div className="slot-form">
        <input
          type="time"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="time"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button onClick={createSlot}>Add Slot</button>
      </div>

      <div className="slot-lists">
        <div className="slot-group">
          <h3>Available Slots</h3>
          <div className="slot-card-list">
            {slots.filter((s) => !s.isBooked).length === 0 ? (
              <p className="no-slots">No available slots</p>
            ) : (
              slots
                .filter((s) => !s.isBooked)
                .map((slot) => (
                  <div key={slot._id} className="slot-card">
                    <span>
                      {slot.from} - {slot.to}
                    </span>
                    <button
                      className="booked-btn"
                      onClick={() =>
                        toggleBooking(slot._id, slot.isBooked)
                      }
                    >
                      Mark as Booked
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="slot-group">
          <h3>Booked Slots</h3>
          <div className="slot-card-list">
            {slots.filter((s) => s.isBooked).length === 0 ? (
              <p className="no-slots">No booked slots</p>
            ) : (
              slots
                .filter((s) => s.isBooked)
                .map((slot) => (
                  <div key={slot._id} className="slot-card booked">
                    <span>
                      {slot.from} - {slot.to}
                    </span>
                    <button
                      className="available-btn"
                      onClick={() =>
                        toggleBooking(slot._id, slot.isBooked)
                      }
                    >
                      Mark as Available
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
