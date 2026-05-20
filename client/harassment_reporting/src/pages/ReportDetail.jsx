// File: src/pages/ReportDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReportForm from '../components/ReportForm';
import ReportList from '../components/ReportList';

const ReportDetail = () => {
  const { id } = useParams(); // Get the report ID from the URL
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]); // To hold all reports
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchReport = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  
  //       const res = await axios.get(`http://localhost:5000/api/reports/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  
  //       setReport(res.data);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Error fetching report:", err);
  //       setError("Failed to load report");
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchReport();
  // }, [id]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all reports
        const res = await axios.get("http://localhost:5000/api/reports/user-reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Find the report that matches the given ID
        const matchingReport = res.data.find(report => report._id === id);

        if (matchingReport) {
          setReports([matchingReport]);  // Set only the matching report in the state
        } else {
          setError("Report not found");  // Handle case where no report matches the ID
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports");
        setLoading(false);
      }
    };

    fetchReports();
  }, [id]);  // Add id as a dependency to re-fetch when the id changes



  if (loading) return <p>Loading report...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <ReportList reports={reports} />
    </div>
  );
};

export default ReportDetail;
