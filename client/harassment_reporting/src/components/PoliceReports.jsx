import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/ViewReports.css';

function ViewReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/police/reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div className="loading-screen">Loading reports...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="reports-container">
      <div className="reports-content">
        <div className="reports-header">
          <h2>📋 View Reports</h2>
        </div>
        
        <div className="reports-grid">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report._id}
                className="report-card"
                onClick={() => navigate(`/policepage/handle-reports/${report._id}`)}
              >
                <h3>{report.description || 'No description available'}</h3>
                <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`status-${report.status.toLowerCase().replace(' ', '-')}`}>
                    {report.status}
                  </span>
                </p>
                {report.reportType && <p><strong>Type:</strong> {report.reportType}</p>}
                {report.location && <p><strong>Location:</strong> {report.location}</p>}
              </div>
            ))
          ) : (
            <div className="no-reports">No reports available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewReports;