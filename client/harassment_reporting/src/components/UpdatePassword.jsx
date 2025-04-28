import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/UpdatePassword.css';

function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login.');
        return;
      }

      const res = await axios.put(
        'http://localhost:5000/api/police/update-password', 
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Password updated successfully');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      console.error('Error updating password', err);
      setError(err.response?.data?.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="password-update-container">
      <div className="password-card">
        <h2 className="password-header">Update Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <label htmlFor="currentPassword" className="input-label">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="newPassword" className="input-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input-field"
            />
            <div className="password-requirements">
              Must be at least 8 characters long
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;