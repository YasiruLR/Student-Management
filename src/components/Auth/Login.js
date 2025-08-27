import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Demo users for testing
  const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'employee', password: 'emp123', role: 'employee' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check against demo users
    const user = demoUsers.find(
      u => u.username === formData.username && u.password === formData.password
    );

    if (user) {
      onLogin({
        username: user.username,
        role: user.role
      });
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Student Management System</h1>
        
        {error && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '5px',
          fontSize: '0.9rem'
        }}>
          <strong>Demo Credentials:</strong><br />
          Admin: username: admin, password: admin123<br />
          Employee: username: employee, password: emp123
        </div>
      </div>
    </div>
  );
};

export default Login;
