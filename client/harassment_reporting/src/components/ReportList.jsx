import React from 'react';
import axios from 'axios';

const ReportList = ({ reports }) => {
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

  if (!reports.length) return <p>No reports found.</p>;

  return (
    <div className="space-y-6">
      {reports.map((report, idx) => (
        <div key={idx} className="p-6 border rounded shadow">
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Location:</strong> {report.location}</p>

          {/* Assigned Station Details */}
          {report.assignedStation && (
            <div className="mt-2">
              <p><strong>Assigned Station:</strong> {report.assignedStation.name}</p>
              <p><strong>Station Location:</strong> {report.assignedStation.location}</p>
            </div>
          )}

          {/* Assigned Officers List */}
          {report.assignedOfficers && report.assignedOfficers.length > 0 && (
            <div className="mt-2">
              <strong>Assigned Officers:</strong>
              <ul className="list-disc list-inside ml-4">
                {report.assignedOfficers.map((officer, officerIdx) => (
                  <li key={officerIdx}>
                    {officer.name} ({officer.rank}) - {officer.email}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-2">
            <strong>Status:</strong>
            <span className={`status ${report.status ? report.status.toLowerCase() : 'pending'}`}>
              {report.status || 'Pending'}
            </span>
          </p>

          <p><strong>Response:</strong> {report.response || 'Officer is on the way'}</p>

          {/* Download Button */}
          {report.status === "Resolved" && (
            <button
              onClick={() => handleDownload(report._id)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download Case History
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReportList;
