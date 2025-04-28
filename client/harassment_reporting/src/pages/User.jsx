import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


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

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>{error}</p>;
  if (!reports.length) {
    return (
      <div className="report-wrapper">
        <Link
          to="/report-submission"
          className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          File Report
        </Link>
        <p>No reports found.</p>
      </div>
    );
  }

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <div className="report-header">
          Reports Dashboard
        </div>

        <Link to="/report-submission" className="report-button">
          File Report
        </Link>

        {/* Scrollable section */}
      <div className="reports-scroll">
          {reports.map((report) => (
            <div key={report._id} className="report-card fade-in">
              <p className="report-description">
                {report.description || "No description available."}
              </p>
              <p className="report-status">
                {report.status}
              </p>

              {/* Optional: Link to view the full report */}
              <Link to={`/report/${report._id}`} className="report-link">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default User;
/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import './style.css';

function User() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleViewDetails = (reportId) => {
    navigate(`/report/${reportId}`);
  };

  if (loading) return <div className="full-screen-loading1"><p>Loading reports...</p></div>;
  if (error) return <div className="full-screen-error1"><p>{error}</p></div>;

  return (
    <div className="dashboard-container1">
      {/* Top Navigation Bar */
      /*<header className="dashboard-navbar1">
        <div className="navbar-header1">Reports Dashboard</div>
        <nav className="navbar-nav1">
          <NavLink 
            to="/user" 
            className={({ isActive }) => isActive ? "nav-item1 active1" : "nav-item1"}
            end
          >
            View Reports
          </NavLink>
          <NavLink 
            to="/report-submission" 
            className={({ isActive }) => isActive ? "nav-item1 active1" : "nav-item1"}
          >
            File Report
          </NavLink>
        </nav>
      </header>

      {/* Main Content */
     /* <main className="dashboard-main-content1">
        <Outlet />
        {window.location.pathname === '/user' && (
          !reports.length ? (
            <div className="empty-reports1 full-screen-center1">
              <p>No reports found.</p>
              <Link to="/report-submission" className="file-report-btn1">
                File Your First Report
              </Link>
            </div>
          ) : (
            <div className="reports-full-container1">
              <div className="reports-grid1">
                {reports.map((report) => (
                  <div 
                    key={report._id} 
                    className="report-card1 fade-in1"
                    onClick={() => handleViewDetails(report._id)}
                  >
                    <h3 className="report-title1">
                      {report.title || "Untitled Report"}
                    </h3>
                    <p className="report-description1">
                      {report.description.length > 150 
                        ? `${report.description.substring(0, 150)}...` 
                        : report.description || "No description available."}
                    </p>
                    <div className="report-meta1">
                      <span className={`report-status1 ${report.status?.toLowerCase()}`}>
                        Status: {report.status || "Pending"}
                      </span>
                      <span className="report-date1">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="view-details-link1">
                      View Details
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default User;*/