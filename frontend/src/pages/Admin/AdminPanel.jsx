import { useEffect, useState } from 'react';
import './AdminPanel.css';
import UserTable from './UserTable';
import DoctorTable from './DoctorTable';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="admin-panel">
      <h1 className="title">Admin Panel</h1>
      <div className="tabs">
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Users</button>
        <button className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}>Doctors</button>
      </div>
      <div className="tab-content">
        {activeTab === 'users' && <UserTable />}
        {activeTab === 'doctors' && <DoctorTable />}
      </div>
    </div>
  );
}