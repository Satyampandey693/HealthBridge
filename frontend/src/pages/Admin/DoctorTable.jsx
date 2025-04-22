import { useEffect, useState } from 'react';
import './Table.css';
import axios from 'axios';
import { useAuth } from '../../store/auth';

export default function DoctorTable() {
  const [doctors, setDoctors] = useState([]);
  const { authorizationToken } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await axios.get('/api/admin/doctors', {
        headers: {
          Authorization: authorizationToken,
        }
      });
      setDoctors(res.data);
    };
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/doctor/delete/${id}`, {
      headers: {
        "Authorization": authorizationToken,
        "Content-Type":"mu"
      }
    });
    setDoctors(doctors.filter(doc => doc._id !== id));
  };

  const toggleAdmin = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'doctor' : 'admin';
    try {
      await axios.patch(
        `/api/admin/doctor/update/${id}`,
        { role: newRole },
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      // Update role in local state for real-time UI update
      setDoctors(doctors.map(doc =>
        doc._id === id ? { ...doc, role: newRole } : doc
      ));
      
    } catch (error) {
      console.error("Error updating doctor role:", error);
    }
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors && doctors.map(doc => (
            <tr key={doc._id}>
              <td>{doc.name}</td>
              <td>{doc.email}</td>
              <td>{doc.specialization}</td>
              <td>{doc.role}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => toggleAdmin(doc._id, doc.role)}
                >
                  {doc.role === 'admin' ? 'Make Doctor' : 'Make Admin'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(doc._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
