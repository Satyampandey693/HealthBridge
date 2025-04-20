import { useState,useEffect } from 'react';
import axios from 'axios';
import './ReportList.css';

export const ReportList = () => {

  const [reports, setReports] = useState([]);

  useEffect(()=>{
    const fetchReports = async () => {
      try {
        const patientId=localStorage.getItem("userID");
        console.log(patientId);
        const res = await axios.get(`http://localhost:5000/api/reports/patient/${patientId}`);
        setReports(res.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  },[]);

  const downloadFile = (filename) => {
    window.open(`http://localhost:5000/api/reports/download/${filename}`, '_blank');
  };

  return (
    <div className="report-list">

      {reports.map((report) => (
        <div key={report._id} className="report-item">
          <div>
            <p><strong>{report.metadata.originalName}</strong></p>
            <p>{new Date(report.uploadDate).toLocaleString()}</p>
          </div>
          <button className="download-btn" onClick={() => downloadFile(report.filename)}>Download</button>
        </div>
      ))}
    </div>
  );
};

