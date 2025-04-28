// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Login.css';



// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('User'); // Match role spelling (User, Police, Admin)
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     console.log("Logging in with:", email, password, role);

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password,
//         role,
//       });

//       console.log("Login successful:", response.data);

//       // Save token to localStorage (or sessionStorage if you want it temporary)
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));

      
//       if(role==="User")navigate('/userpage');
//       else if(role==="Police")navigate('/policepage');
//       else if(role==="Admin")navigate('/adminpage');
      
//     } catch (error) {
//       console.error("Login failed:", error.response?.data || error.message);
//       alert(error.response?.data?.message || 'Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="login-container">
//   <div className="login-box">
//     <h2 className="login-title">Login</h2>
//     <form onSubmit={handleLogin} className="login-form">
//       <input
//         type="email"
//         placeholder="Email"
//         className="login-input"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="login-input"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <select
//         className="login-input"
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//         required
//       >
//         <option value="User">User</option>
//         <option value="Police">Police</option>
//         <option value="Admin">Admin</option>
//       </select>
//       <button type="submit" className="login-button">Login</button>
//     </form>
//     <p className="login-register-text">
//       Don't have an account?{' '}
//       <span className="login-register-link" onClick={() => navigate('/register')}>
//         Register
//       </span>
//     </p>
//   </div>
// </div>

//   );
// }

// export default Login;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/Login.css';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('User');
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [registerEmail, setRegisterEmail] = useState('');
//   const [registerPassword, setRegisterPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     console.log("Logging in with:", email, password, role);

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password,
//         role,
//       });

//       console.log("Login successful:", response.data);
//       localStorage.setItem('token', response.data.token);
//       localStorage.setItem('user', JSON.stringify(response.data.user));
      
//       if(role==="User") navigate('/userpage');
//       else if(role==="Police") navigate('/policepage');
//       else if(role==="Admin") navigate('/adminpage');
      
//     } catch (error) {
//       console.error("Login failed:", error.response?.data || error.message);
//       alert(error.response?.data?.message || 'Login failed. Please try again.');
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     console.log("Registering with:", registerEmail, registerPassword);
//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/register", {
//         email: registerEmail,
//         password: registerPassword,
//       });
     
//       setShowRegisterModal(false);
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert(error.response?.data?.message || 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">Login</h2>
//         <form onSubmit={handleLogin} className="login-form">
//           <input
//             type="email"
//             placeholder="Email"
//             className="login-input"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="login-input"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <select
//             className="login-input"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             required
//           >
//             <option value="User">User</option>
//             <option value="Police">Police</option>
//             <option value="Admin">Admin</option>
//           </select>
//           <button type="submit" className="login-button">Login</button>
//         </form>
//         <p className="login-register-text">
//           Don't have an account?{' '}
//           <span 
//             className="login-register-link" 
//             onClick={() => setShowRegisterModal(true)}
//           >
//             Register
//           </span>
//         </p>
//       </div>

//       {/* Register Modal/Popup */}
//       {showRegisterModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h2>Register</h2>
//               <button 
//                 className="close-button" 
//                 onClick={() => setShowRegisterModal(false)}
//               >
//                 &times;
//               </button>
//             </div>
//             <form className="register-form" onSubmit={handleRegister}>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="register-input"
//                 value={registerEmail}
//                 onChange={(e) => setRegisterEmail(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="register-input"
//                 value={registerPassword}
//                 onChange={(e) => setRegisterPassword(e.target.value)}
//                 required
//               />
//               <button type="submit" className="register-button">Register</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password, role);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      console.log("Login successful:", response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if(role==="User") navigate('/userpage');
      else if(role==="Police") navigate('/policepage');
      else if(role==="Admin") navigate('/adminpage');
      
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      showTemporaryAlert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const showTemporaryAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Registering with:", registerEmail, registerPassword);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email: registerEmail,
        password: registerPassword,
      });
      showTemporaryAlert("Registration successful! You can now login.");
      setRegisterEmail('');
      setRegisterPassword('');
      setShowRegisterModal(false);
    } catch (error) {
      console.error("Registration failed:", error);
      showTemporaryAlert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {/* Alert Message */}
      {showAlert && (
        <div className="alert-message">
          {alertMessage}
        </div>
      )}

      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="login-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="User">User</option>
            <option value="Police">Police</option>
            <option value="Admin">Admin</option>
          </select>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-register-text">
          Don't have an account?{' '}
          <span 
            className="login-register-link" 
            onClick={() => setShowRegisterModal(true)}
          >
            Register
          </span>
        </p>
      </div>

      {/* Register Modal/Popup */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Register</h2>
              <button 
                className="close-button" 
                onClick={() => setShowRegisterModal(false)}
              >
                &times;
              </button>
            </div>
            <form className="register-form" onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                className="register-input"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="register-input"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <button type="submit" className="register-button">Register</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;