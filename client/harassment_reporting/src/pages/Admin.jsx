import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      {/* Compact Red Navbar */}
      <nav className="admin-navbar">
        <div className="navbar-content">
          <div className="navbar-title">🚨 Police Admin Console</div>
          <div className="navbar-links">
            
            
            
            <a href="/" style={{ color: '#ffcdd2' }}>Logout</a>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="admin-main">
        <center>
        <h1 id="titlename">Administrator Dashboard</h1>
        </center>
        <div className="card-container">
          <div 
            className="admin-card" 
            onClick={() => navigate("/admin/add-police")}
          >
            <h3>👮 Add Officer</h3>
            <p>Register new police personnel and assign them to stations with customized access levels.</p>
          </div>
          
          <div 
            className="admin-card" 
            onClick={() => navigate("/admin/view-reports")}
          >
            <h3>📊 Incident Reports</h3>
            <p>View, filter, and analyze all incident reports with advanced search capabilities.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;