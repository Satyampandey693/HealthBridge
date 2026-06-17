import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaFileMedical, FaDownload } from 'react-icons/fa';
import api from '../api/client.js';
import { useAuth } from '../store/auth.jsx';
import { Loader } from '../components/Loader.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import './ReportList.css';

export const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userID } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get(`/api/reports/patient/${userID}`);
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userID) fetchReports();
  }, [userID]);

  // Download via the authed client (window.open can't send the bearer token),
  // then hand the blob to the browser as a file.
  const downloadFile = async (filename, displayName) => {
    try {
      const res = await api.get(`/api/reports/download/${filename}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = displayName || filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Could not download report');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="report-list-container hb-container">
      <h2 className="report-list-title">Your Lab Reports</h2>
      {reports.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No reports yet"
          message="Reports uploaded by your doctor will appear here."
        />
      ) : (
        <div className="report-list">
          {reports.map((report) => (
            <div key={report._id} className="report-card hb-card">
              <div className="report-card__icon"><FaFileMedical /></div>
              <div className="report-info">
                <h3>{report.metadata?.originalName || report.filename}</h3>
                {report.metadata?.description && (
                  <p className="report-desc">{report.metadata.description}</p>
                )}
                <p className="report-meta">
                  {report.metadata?.doctorName && (
                    <span className="report-doctor">Dr. {report.metadata.doctorName}</span>
                  )}
                  <span className="date">{new Date(report.uploadDate).toLocaleDateString()}</span>
                </p>
              </div>
              <button
                className="download-btn"
                onClick={() => downloadFile(report.filename, report.metadata?.originalName)}
              >
                <FaDownload /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
