// File: src/components/ReportForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = ({ onReportSubmit }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/reports',
        { description, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Report submitted successfully!');
      setDescription('');
      setLocation('');
      onReportSubmit();
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit report.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <h3 className="text-xl font-semibold mb-2">Submit a New Report</h3>
      <div className="mb-2">
        <label>Description:</label>
        <input
          type="text"
          className="w-full border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label>Location:</label>
        <input
          type="text"
          className="w-full border p-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Report
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
};

export default ReportForm;