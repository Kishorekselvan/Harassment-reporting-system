import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/ViewReportsAdmin.css";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uniqueStatuses, setUniqueStatuses] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data && res.data.reports) {
        setReports(res.data.reports);
        setFilteredReports(res.data.reports);
        const statuses = [...new Set(res.data.reports.map((r) => r.status))];
        setUniqueStatuses(statuses);
      } else {
        setError("Reports data is missing or malformed");
      }
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
      document.querySelector(".view-reports-container").classList.add("loaded");
    }
  };

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    if (selectedStatus === "all") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((r) => r.status === selectedStatus));
    }
  };

  return (
    <div className="view-reports-wrapper">
      {/* Navbar matching Admin theme */}
      <nav className="view-reports-navbar">
        <div className="navbar-title">Police Admin Console</div>
      </nav>

      {/* Main Content */}
      <div className="view-reports-container">
        <h1 id="titlename">View All Reports</h1>

        <div className="status-filter">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            {uniqueStatuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-message">Loading reports...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-message">No reports found matching the selected filter.</div>
        ) : (
          <div className="reports-grid">
            {filteredReports.map((report) => (
              <div key={report._id} className="report-card">
                <Link to={`/report-detail/${report._id}`}>
                  <h3>{report.description}</h3>
                  <p>Status: <span style={{ 
                    color: report.status === 'resolved' ? '#2e7d32' : 
                          report.status === 'pending' ? '#d32f2f' : '#333'
                  }}>{report.status}</span></p>
                  <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReports;