import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PoliceDetails.css';

function PoliceDetails() {
  const [police, setPolice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPoliceDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/police/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPolice(res.data);
      } catch (err) {
        console.error("Failed to fetch police details", err);
        setError('Failed to fetch police details');
      } finally {
        setLoading(false);
      }
    };

    fetchPoliceDetails();
  }, []);

  if (loading) return <div className="loading-screen">Loading police details...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="full-screen-container">
      <div className="centered-content">
        <div className="police-details-header">
          
          <h2>Police Officer Profile</h2>
        </div>
        
        <div className="profile-card">
          <div className="profile-section">
            <div className="profile-icon">👤</div>
            <div className="profile-info">
              <h3>Personal Information</h3>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{police.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{police.email}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-icon">🛡️</div>
            <div className="profile-info">
              <h3>Service Information</h3>
              <div className="detail-row">
                <span className="detail-label">Rank:</span>
                <span className="detail-value">{police.rank}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Station:</span>
                <span className="detail-value">{police.stationName}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-icon">📋</div>
            <div className="profile-info">
              <h3>Additional Details</h3>
              <div className="detail-row">
                <span className="detail-label">Badge No:</span>
                <span className="detail-value">{police.badgeNumber || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{police.department || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliceDetails;