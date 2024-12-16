
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import amperorImage from './Images/amperor.jpg'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials. Please try again.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access); 
      localStorage.setItem('role', data.role); 

      // Redirect to the appropriate dashboard based on user role
      if (data.role === 'admin') {
        navigate('/admin-dashboard'); // Navigate to admin dashboard
      } else {
        navigate('/employee-dashboard'); // Navigate to employee dashboard
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${amperorImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      position: 'relative',
    }}>
      {/* Blurred background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // filter: 'blur(5px)',
        zIndex: 1,
      }}></div>
      
      {/* Login Form */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background for the form
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        width: '300px',
        margin: 'auto',
        top: '50%',
        transform: 'translateY(-50%)', // Center the form vertically
        textAlign: 'left', // Align text to the left
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
