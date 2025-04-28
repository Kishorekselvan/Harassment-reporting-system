import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/PoliceNavbar.css';

function PoliceNavbar() {
  return (
    <nav className="police-navbar">
      <div className="navbar-title">
        
        <span>Police Dashboard</span>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="police-details" 
          end 
          className={({ isActive }) => 
            `navbar-link ${isActive ? 'active' : ''}`
          }
        >
          Police Details
        </NavLink>
        <NavLink 
          to="reports" 
          className={({ isActive }) => 
            `navbar-link ${isActive ? 'active' : ''}`
          }
        >
          View Reports
        </NavLink>
        <NavLink 
          to="update-profile" 
          className={({ isActive }) => 
            `navbar-link ${isActive ? 'active' : ''}`
          }
        >
          Update Profile
        </NavLink>
        <NavLink 
          to="update-password" 
          className={({ isActive }) => 
            `navbar-link ${isActive ? 'active' : ''}`
          }
        >
          Update Password
        </NavLink>
      </div>
    </nav>
  );
}

export default PoliceNavbar;