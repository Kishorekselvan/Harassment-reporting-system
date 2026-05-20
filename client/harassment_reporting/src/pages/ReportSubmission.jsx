import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "../styles/ReportSubmission.css";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });

  return position ? <Marker position={position} /> : null;
}

function ReportSubmission() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [errorAlert, setErrorAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
      () => alert("Location permission denied")
    );
  }, []);
const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  if (!location || location.lat == null || location.lng == null) {
    setErrorAlert("Please select a location on the map");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/reports/submit",
      {
        description,
        location: {
          lat: Number(location.lat),
          lng: Number(location.lng)
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Report submitted successfully!");
    navigate("/userpage");
  } catch (error) {
    console.error(error);
    setErrorAlert("Failed to submit report");
  }
};


  return (
    <div className="report-sub-container">
      <div className="report-card">
        <h2 className="report-title">Submit New Report</h2>

        {errorAlert && <p className="error-alert">{errorAlert}</p>}

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
            <label>Select Location</label>

            {location && (
              <MapContainer
                center={location}
                zoom={15}
                style={{ height: "350px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <LocationMarker
                  position={location}
                  setPosition={setLocation}
                />
              </MapContainer>
            )}
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
