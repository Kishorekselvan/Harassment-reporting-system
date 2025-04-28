import React, { useState } from "react";
import axios from "axios";
// import './ReportSubmission.css';

function ReportSubmission() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/reports/submit",
        { description, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Report submitted successfully!");
      setDescription("");
      setLocation("");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit report");
    }
  };

  return (
    <div className="report-container">
    <div className="report-card">
      <h2 className="report-title">Submit New Report</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Submit Report
        </button>
      </form>
    </div>
  </div>
  );
}

export default ReportSubmission;
