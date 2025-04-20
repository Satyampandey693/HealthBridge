import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';

export const UploadForm = () => {
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !doctorId || !patientId) return alert('All fields are required');
  
    const formData = new FormData();
    formData.append('report', file);
    formData.append('doctorId', doctorId); 
    formData.append('patientId', patientId);
  
    try {
      console.log(file);
      console.log(doctorId);
      console.log(patientId);
      const check=await axios.post("http://localhost:5000/api/reports/upload?doctorId=6801f04985b38ce0ab98d931&patientId=680233b62e7b0fc6d26f972a", formData);
      console.log(check);
      alert('Upload successful!');
    } catch (error) {
      alert('Upload failed!');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <input
        type="text"
        placeholder="Doctor ID"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button type="submit">Upload Report</button>
    </form>
  );
};

