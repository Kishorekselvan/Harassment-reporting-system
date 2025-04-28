// Police.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import PoliceNavbar from '../components/Policenavbar';

function Police() {
  return (
    <div className="police_p  age">
      <PoliceNavbar />
      <div style={{ paddingTop: '60px', padding: '20px' }}>
        
        <Outlet />
      </div>
    </div>
  );
}

export default Police;