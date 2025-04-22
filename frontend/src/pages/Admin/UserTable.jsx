import { useEffect, useState } from 'react';
import './Table.css';
import axios from "axios";
import { useAuth } from '../../store/auth';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const { authorizationToken } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get('/api/admin/users', {
        headers: {
          Authorization: authorizationToken,
        }
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/doctor/delete/${id}`, {
      headers: {
        Authorization: authorizationToken,
      }
    });
    setUsers(users.filter(user => user._id !== id));
  };

  const toggleAdmin = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'patient' : 'admin';
    try {
      await axios.patch(
        `/api/admin/user/update/${id}`,
        { role: newRole },
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      // Update user list in-place
      setUsers(users.map(user => 
        user._id === id ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => toggleAdmin(user._id, user.role)}
                >
                  {user.role === 'admin' ? 'Make Patient' : 'Make Admin'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
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
