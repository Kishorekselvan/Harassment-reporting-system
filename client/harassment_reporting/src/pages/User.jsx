import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/UserDashboard.css'
function User() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/reports/user-reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports");
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="loading-screen">Loading reports...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <h1>Reports Dashboard</h1>
        <Link to='/' className="logout-button-user">
  Log out
</Link>

        <Link 
          to="/report-submission" 
          className="file-report-button glow-on-hover"
        >
          + File New Report
        </Link>
      </header>

      {!reports.length ? (
        <div className="no-reports">
          <p>You haven't filed any reports yet.</p>
          
        </div>
      ) : (
        <div className="reports-grid-container">
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report._id} className="report-card">
                <div className="card-content">
                  <p className="report-title">
                    {report.description || "Untitled Report"}
                  </p>
                  
                  <div className="card-footer">
                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                    <Link to={`/report/${report._id}`} className="view-details">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default User;