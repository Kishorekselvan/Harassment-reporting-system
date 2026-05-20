import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UpdateProfile.css';

function UpdateProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    stationName: '',
    rank: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/police/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        setIsSubmitting(false);
        return;
      }

      const res = await axios.put(
        'http://localhost:5000/api/police/profile/update',
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Profile updated successfully');
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-screen">
      Loading profile...
    </div>
  );

  if (error) return (
    <div className="profile-update-container">
      <div className="profile-card">
        <div className="error-message">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="profile-update-container">
      <div className="profile-card">
        <h2 className="profile-header">
          <span>👮</span>
          Update Profile
        </h2>
        
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label htmlFor="name" className="input-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
  <label htmlFor="stationName" className="input-label">Police Station</label>
  <select
    id="stationName"
    name="stationName"
    value={profile.stationName}
    onChange={handleChange}
    required
    className="input-field"
  >
    <option value="">Select a station</option>
    <option value="T Nagar Police Station">T Nagar Police Station</option>
    <option value="Adyar Police Station">Adyar Police Station</option>
    <option value="Velachery Police Station">Velachery Police Station</option>
  </select>
</div>

          <div className="input-group">
            <label htmlFor="rank" className="input-label">Rank/Position</label>
            <input
              type="text"
              id="rank"
              name="rank"
              value={profile.rank}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;