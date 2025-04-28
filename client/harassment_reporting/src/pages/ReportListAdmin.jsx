import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./ReportList.css";

function ReportList() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/reports");
        setReports(res.data.reports);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="report-page">
      <h2>All Reports</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="report-description-list">
          {reports.map((report) => (
            <li key={report._id}>{report.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReportList;
