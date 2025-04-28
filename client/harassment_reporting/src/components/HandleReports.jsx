import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
 import '../styles/HandleReports.css';

function HandleReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [resolveFile, setResolveFile] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setReport(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleResponseSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/reports/${id}/respond`,
        { response: responseText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setReport(res.data.report);
      setShowResponseModal(false);
      setResponseText('');
    } catch (err) {
      console.error('Error submitting response in frontend:', err);
    }
  };

  const handleResolveSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("TOken",token);
      const formData = new FormData();
      formData.append('reportId', id);
      if (resolveFile) formData.append('caseHistory', resolveFile);

      const res = await axios.post(
        `http://localhost:5000/api/police/resolve-report`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setReport({ ...report, status: 'Resolved' });
      setShowResolveModal(false);
    } catch (err) {
      console.error('Error resolving report in frontend:', err);
    }
  };

  if (loading) return (
    <div className="full-screen-report">
      <div className="report-container">
        <div className="loading-message">Loading report details...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="full-screen-report">
      <div className="report-container">
        <div className="error-message">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="full-screen-report">
      <div className="report-container">
        <h2 className="report-header">📝 Report Details</h2>
        
        <div className="report-details-grid">
          <div className="detail-card">
            <div className="detail-label">Description</div>
            <div className="detail-value">{report.description}</div>
          </div>
          
          <div className="detail-card">
            <div className="detail-label">Location</div>
            <div className="detail-value">{report.location}</div>
          </div>
          
          <div className="detail-card">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <span className={`status-indicator status-${report.status.toLowerCase().replace(' ', '-')}`}>
                {report.status}
              </span>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-label">Response</div>
            <div className="detail-value">{report.response || 'No response yet'}</div>
          </div>
          
          <div className="detail-card">
            <div className="detail-label">Created At</div>
            <div className="detail-value">{new Date(report.createdAt).toLocaleString()}</div>
          </div>
          
          <div className="detail-card">
            <div className="detail-label">Assigned Station</div>
            <div className="detail-value">{report.assignedStation?.name || 'N/A'}</div>
          </div>
        </div>

        <div className="officers-section">
          <h3 className="officers-title">Assigned Officers</h3>
          {report.assignedOfficers?.length ? (
            <table className="officers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Email</th>
                  <th>Badge Number</th>
                </tr>
              </thead>
              <tbody>
                {report.assignedOfficers.map((officer) => (
                  <tr key={officer._id}>
                    <td>{officer.name}</td>
                    <td>{officer.rank}</td>
                    <td>{officer.email}</td>
                    <td>{officer.badgeNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No officers assigned.</p>
          )}
        </div>

        {report.status !== 'Resolved' && (
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setShowResponseModal(true)}>
              Respond to Report
            </button>
            <button className="btn btn-secondary" onClick={() => setShowResolveModal(true)}>
              Resolve Report
            </button>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3 className="modal-header">Respond to Report</h3>
              <div className="modal-body">
                <textarea
                  className="modal-textarea"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your official response here..."
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowResponseModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleResponseSubmit}>
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resolve Modal */}
        {showResolveModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h3 className="modal-header">Resolve Report</h3>
              <div className="modal-body">
                <p>Please attach any relevant case history documents:</p>
                <input
                  type="file"
                  className="modal-file-input"
                  onChange={(e) => setResolveFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="small-text">Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowResolveModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleResolveSubmit}>
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HandleReport;