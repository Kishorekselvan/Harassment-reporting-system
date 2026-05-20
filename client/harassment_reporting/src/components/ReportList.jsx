import React from "react";
import axios from "axios";
import "../styles/ReportList.css";
import { useNavigate, Link } from "react-router-dom";

/* ---------- SAFE RENDER HELPERS ---------- */

const renderReportLocation = (location) => {
  if (!location) return "Unknown location";

  // New format: { lat, lng }
  if (typeof location === "object" && "lat" in location && "lng" in location) {
    return `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
  }

  // Old format: string
  if (typeof location === "string") {
    return location;
  }

  return "Unknown location";
};

const renderStationLocation = (location) => {
  if (!location) return "Unknown";

  // GeoJSON format
  if (
    typeof location === "object" &&
    location.type === "Point" &&
    Array.isArray(location.coordinates)
  ) {
    const [lng, lat] = location.coordinates;
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  // String fallback
  if (typeof location === "string") {
    return location;
  }

  return "Unknown";
};

/* ---------- GOOGLE MAP LINK HELPER ---------- */

const getGoogleMapsLink = (location) => {
  if (!location) return null;

  // Report location: { lat, lng }
  if (typeof location === "object" && "lat" in location && "lng" in location) {
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  }

  // Station location: GeoJSON
  if (
    typeof location === "object" &&
    location.type === "Point" &&
    Array.isArray(location.coordinates)
  ) {
    const [lng, lat] = location.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  return null;
};

/* ---------- COMPONENT ---------- */

const ReportList = ({ reports }) => {
  const navigate = useNavigate();

  const handleDownload = async (reportId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios({
        url: `http://localhost:5000/api/reports/case-history/${reportId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        responseType: "blob"
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf"
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `case-history-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error", err);
      alert("Failed to download case history PDF.");
    }
  };

  if (!reports || reports.length === 0) {
    return <p className="no-reports">No reports found.</p>;
  }

  return (
    <div className="report-list-container">
      {reports.map((report, idx) => (
        <div key={idx} className="report-card">
          <Link
            to={`/chat/user/${report._id}`}
            style={{
              textDecoration: "none",
              backgroundColor: "#2c3e50",
              color: "white",
              padding: "8px 14px",
              borderRadius: "4px",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}
          >
            Chat Box
          </Link>

          <h1>Report Details</h1>

          <p>
            <strong>Description:</strong> {report.description}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {renderReportLocation(report.location)}
            {getGoogleMapsLink(report.location) && (
              <>
                {" "}
                |{" "}
                <a
                  href={getGoogleMapsLink(report.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  Open in Maps
                </a>
              </>
            )}
          </p>

          {/* Assigned Station */}
          {report.assignedStation && (
            <div className="station-details">
              <p>
                <strong>Assigned Station:</strong>{" "}
                {report.assignedStation.name}
              </p>
              {/*<p>
                <strong>Station Location:</strong>{" "}
                {renderStationLocation(report.assignedStation.location)}
                {getGoogleMapsLink(report.assignedStation.location) && (
                  <>
                    {" "}
                    |{" "}
                    <a
                      href={getGoogleMapsLink(
                        report.assignedStation.location
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      Open in Maps
                    </a>
                  </>
                )}
              </p>*/}
            </div>
          )}

          {/* Assigned Officers */}
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
            <span
              className={`status ${
                report.status
                  ? report.status.toLowerCase().replace(" ", "-")
                  : "pending"
              }`}
            >
              {report.status || "Pending"}
            </span>
          </p>

          <p>
            <strong>Response:</strong>{" "}
            {report.response || "The officer still has not responded"}
          </p>

          {/* Download */}
          {report.status === "Resolved" && (
            <button
              onClick={() => handleDownload(report._id)}
              className="download-btn"
            >
              Download Case Investigation Summary
            </button>
          )}

          <button
            onClick={() => navigate("/userpage")}
            className="back-to-user"
          >
            Back to user page
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReportList;
