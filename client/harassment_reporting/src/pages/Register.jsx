import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Registering with:", email, password);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
      });
       // Displaying success message
      navigate('/'); // Redirect to the homepage after successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Binding the email state
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Binding the password state
            required
          />
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="register-login-text">
        
        </p>
      </div>
    </div>
  );
}

export default Register;
