import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode === 'light' ? false : true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Add animation class to form on mount
    const form = document.querySelector('.login-card');
    if (form) {
      form.classList.add('slide-in');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/login`, { username, password });

      // Store user information in localStorage
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('username', response.data.username);
      
      // Add success animation before navigating
      setTimeout(() => {
        navigate('/chat');
      }, 500);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <button onClick={toggleTheme} className="theme-toggle-fab" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        {isDarkMode ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
      
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-icon-large">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.72 3.63 17.19L2.05 21.95L6.93 20.4C8.36 21.37 10.1 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="url(#logo-gradient-login)"/>
              <defs>
                <linearGradient id="logo-gradient-login" x1="2" y1="2" x2="22" y2="22">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="app-title">SafeChat</h1>
          <p className="app-tagline">AI-Protected Messaging</p>
        </div>
        
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue your conversations</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <div className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                Login
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </form>
        
        <p className="login-signup-link">
          Don't have an account? <Link to="/signup" className="link-highlight">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
