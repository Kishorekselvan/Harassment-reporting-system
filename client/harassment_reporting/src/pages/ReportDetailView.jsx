import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ReportDetailView.css";

const ReportDetailView = () => {
  const navigate=useNavigate();
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReportDetail = async () => {
    try {
      
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/admin/reports/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const matchingReport = res.data.reports.find(report => report._id === reportId);
      if (matchingReport) setReport(matchingReport);
      else setError("Report not found");
      setLoading(false);
    } catch (err) {
      setError("Failed to load reports");
      setLoading(false);
    }
  };

  useEffect(() => { fetchReportDetail(); }, [reportId]);

  if (loading) return <div className="loading-spinner">Loading report details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!report) return <div className="error-message">Report data not available</div>;

  return (
    <div className="single-page-report">
      {/* Navbar matching Admin theme */}
      <nav className="report-navbar">
        <div className="navbar-title">Police Admin Console</div>
      </nav>

      {/* Main Content */}
      <div className="report-content">
        {/* Header Section */}
        <div className="report-header">
          <div className="header-content">
            <h1>INCIDENT REPORT</h1>
            <button className="back-button" onClick={()=>navigate('/admin/view-reports')}>Back to reports </button> 
            <div className="header-meta">
            
             
              <span className={`status-badge ${report.status}`}>
                {report.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="header-footer">
            <span>Report Submitted Date:{new Date(report.createdAt).toLocaleDateString()}</span>
            <span>Location: {report.location}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="report-grid">
          {/* Incident Details */}
          <div className="incident-card">
            <h2>INCIDENT DETAILS</h2>
            <p className="incident-description">{report.description}</p>
            <div className="incident-meta">
              {/* <div>
                <span className="meta-label">Priority</span>
                <span className="meta-value">{report.priority}</span>
              </div> */}
              <div>
                <span className="meta-label">Reporter</span>
                <span className="meta-value">{report.reporter?.email || "Anonymous"}</span>
              </div>
            </div>
          </div>

          {/* Assigned Station */}
          <div className="station-card">
            <h2>ASSIGNED STATION</h2>
            <h3>{report.assignedStation.name}</h3>
            <div className="station-details">
              <div>
                <span className="detail-label">Location</span>
                <span className="detail-value">{report.assignedStation.location}</span>
              </div>
             
            </div>
          </div>

          {/* Assigned Officers */}
          <div className="officers-card">
            <h2>ASSIGNED OFFICERS ({report.assignedOfficers.length})</h2>
            {report.assignedOfficers.length > 0 ? (
              <div className="officers-grid">
                {report.assignedOfficers.map((officer, index) => (
                  <div key={index} className="officer-badge">
                    <div className="officer-initial">{officer.email.charAt(0).toUpperCase()}</div>
                    <span>{officer.email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-officers">No officers assigned</div>
            )}
          </div>

          {/* Response Section */}
          {report.response && (
            <div className="response-card">
              <h2>OFFICIAL RESPONSE</h2>
              <p className="response-text">{report.response}</p>
              <div className="response-footer">
                {/* <span>By: {report.respondedBy || "System"}</span>
                <span>{new Date(report.updatedAt).toLocaleString()}</span> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailView;