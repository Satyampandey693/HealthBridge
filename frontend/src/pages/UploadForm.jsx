import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt } from 'react-icons/fa';
import api from '../api/client.js';
import { useAuth } from '../store/auth.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import './UploadForm.css';

export const UploadForm = () => {
  const { userID: doctorId } = useAuth();
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Doctor uploads for one of their own patients — fetch that list.
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get(`/api/doctor/${doctorId}/patients`);
        setPatients(data.patients || []);
      } catch (err) {
        console.error('Failed to load patients:', err);
      }
    };
    if (doctorId) fetchPatients();
  }, [doctorId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !patientId) {
      toast.error('Please select a patient and a file');
      return;
    }

    const formData = new FormData();
    formData.append('report', file);

    setUploading(true);
    try {
      // multer (GridFS storage) reads doctorId/patientId/description from the query string.
      const qs = new URLSearchParams({ doctorId, patientId, description }).toString();
      await api.post(
        `/api/reports/upload?${qs}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Report uploaded successfully!');
      setFile(null);
      setPatientId('');
      setDescription('');
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-wrapper hb-container">
      <div className="upload-card hb-card">
        <div className="upload-card__head">
          <FaCloudUploadAlt className="upload-card__icon" />
          <h2>Upload Patient Report</h2>
          <p>Share lab results or documents with your patient.</p>
        </div>

        {patients.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No patients yet"
            message="Patients who book a consultation with you will appear here."
          />
        ) : (
          <form onSubmit={handleUpload} className="upload-form">
            <label>
              <span>Patient</span>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                <option value="" disabled>Select a patient</option>
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>{p.name}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Description</span>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Complete blood count — fasting"
                maxLength={120}
              />
            </label>

            <label>
              <span>Report file</span>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </label>

            <button type="submit" className="hb-btn hb-btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
