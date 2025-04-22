import { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportList.css';

export const ReportList = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const patientId = localStorage.getItem("userID");
        const res = await axios.get(`http://localhost:5000/api/reports/patient/${patientId}`);
        setReports(res.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  const downloadFile = (filename) => {
    window.open(`http://localhost:5000/api/reports/download/${filename}`, '_blank');
  };

  return (
    <div className="report-list-container">
      <h2>Your Lab Reports</h2>
      {reports.length === 0 ? (
        <p className="no-reports">No reports found.</p>
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <div className="report-info">
                <h3>{report.metadata.originalName}</h3>
                <p className="date">{new Date(report.uploadDate).toLocaleString()}</p>
              </div>
              <button className="download-btn" onClick={() => downloadFile(report.filename)}>
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
