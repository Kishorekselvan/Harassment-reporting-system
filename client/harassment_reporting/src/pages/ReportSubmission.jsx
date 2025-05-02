import React, { useState } from "react";
import axios from "axios";
import '../styles/ReportSubmission.css'
import { useNavigate } from "react-router-dom";
function ReportSubmission() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Velachery");
  const [errorAlert, setErrorAlert] = useState(null);
  const navigate=useNavigate();
  const showTemporaryAlert = (message) => {
    setErrorAlert(message);
    setTimeout(() => {
      setErrorAlert(null);
    }, 3000); // 3 seconds
  };

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
      setLocation("Velachery");
      navigate('/userpage');
    } catch (error) {
      console.error("Submission failed:", error);
      showTemporaryAlert("Failed to submit report");
    }
  };

  return (
    <div className="report-sub-container">
      <div className="report-card">
        <h2 className="report-title">Submit New Report</h2>
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Description</label>
            <p>Make the description clear consice. Our officers will bring justics. Identification details and speicifying the exact location of crime woulb be helpful.</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-dropdown"
              required
            >
              <option value="Velachery">Velachery</option>
              <option value="Adyar">Adyar</option>
              <option value="T Nagar">T Nagar</option>
            </select>
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