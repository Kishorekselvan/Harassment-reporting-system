import React from 'react';
import axios from 'axios';
import '../styles/ReportList.css';
import { Navigate, useNavigate } from 'react-router-dom';

const ReportList = ({ reports }) => {
  const navigate=useNavigate();
  const handleDownload = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token", token);

      const response = await axios({
        url: `http://localhost:5000/api/reports/case-history/${reportId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `case-history-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Download error', err);
      alert("Failed to download case history PDF.");
    }
  };

  if (!reports.length) return <p className="no-reports">No reports found.</p>;

  return (
    <div className="report-list-container">
      {reports.map((report, idx) => (
        <div key={idx} className="report-card">
          <h1>Report Details</h1>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Location:</strong> {report.location}</p>

          {/* Assigned Station Details */}
          {report.assignedStation && (
            <div className="station-details">
              <p><strong>Assigned Station:</strong> {report.assignedStation.name}</p>
              <p><strong>Station Location:</strong> {report.assignedStation.location}</p>
            </div>
          )}

          {/* Assigned Officers Table */}
          {report.assignedOfficers && report.assignedOfficers.length > 0 && (
            <div className="officers-section">
              <strong>Assigned Officers:</strong>
              <table className="officers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rank</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {report.assignedOfficers.map((officer, officerIdx) => (
                    <tr key={officerIdx}>
                      <td>{officer.name}</td>
                      <td>{officer.rank}</td>
                      <td>{officer.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="status-container">
            <strong>Status:</strong>
            <span className={`status ${report.status ? report.status.toLowerCase().replace(' ', '-') : 'pending'}`}>
              {report.status || 'Pending'}
            </span>
          </p>

          <p><strong>Response:</strong> {report.response || 'The officer still has not responded'}</p>
          

          {/* Download Button */}
          {report.status === "Resolved" && (
            <button
              onClick={() => handleDownload(report._id)}
              className="download-btn"
            >
              Download Case Investigaton Summary
            </button>
          )}
          <button onClick={()=>navigate('/userpage')} className='back-to-user'>Back to user page</button>
         
        </div>
      ))}
    </div>
  );
};

export default ReportList;