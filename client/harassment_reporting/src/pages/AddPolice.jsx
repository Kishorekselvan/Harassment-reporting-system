import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AddPolice.css";

function AddPolice() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stationName, setStationName] = useState("");
  const [rank, setRank] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/stations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStations(response.data.stations);
      } catch (error) {
        setErrorMessage("Failed to fetch stations");
      }
    };
    fetchStations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !stationName || !rank || !badgeNumber || !department) {
      setErrorMessage("All fields are required.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("No authorization token found.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/admin/add-police",
        {
          name,
          email,
          password,
          stationName,
          rank,
          badgeNumber,
          department,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setName("");
      setEmail("");
      setPassword("");
      setStationName("");
      setRank("");
      setBadgeNumber("");
      setDepartment("");
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Server error");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-police-container">
      {/* Navbar matching Admin theme */}
      <nav className="add-police-navbar">
        <div className="navbar-title">Police Admin Console</div>
      </nav>

      {/* Main Form Content */}
      <main className="add-police-main">
        <h1>Add Police Officer</h1>
        
        <form className="add-police-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Station Name:</label>
            <select
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
            >
              <option value="">Select Station</option>
              {stations.map((station) => (
                <option key={station._id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Rank:</label>
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Badge Number:</label>
            <input
              type="text"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Department:</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Adding Officer..." : "Add Police Officer"}
          </button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </main>
    </div>
  );
}

export default AddPolice;