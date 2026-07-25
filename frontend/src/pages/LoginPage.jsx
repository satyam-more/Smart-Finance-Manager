import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const { loginUser } = useAppContext();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const username = authForm.username.trim();
    const password = authForm.password;

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (authMode === 'register') {
      if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }
      if (password !== authForm.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          setAuthMode('login');
          setAuthForm({ username, password: '', confirmPassword: '' });
        } else {
          alert(data.error || "Registration failed.");
        }
      } catch (err) {
        alert("Could not connect to the backend server. Please verify app.py is running.");
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
          loginUser(data.user);
          setAuthForm({ username: '', password: '', confirmPassword: '' });
          navigate('/');
        } else {
          alert(data.error || "Invalid username or password.");
        }
      } catch (err) {
        alert("Could not connect to the backend server. Please verify app.py is running.");
      }
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-marketing-side">
        <div className="brand-logo" style={{ marginBottom: '3rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.6rem' }}>
            <defs>
              <linearGradient id="shield-grad-1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="shield-grad-2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#5b21b6" />
              </linearGradient>
            </defs>
            <path d="M12 2L3 7v6c0 5.25 3.85 10.14 9 11C10 20 8 15 12 2Z" fill="url(#shield-grad-1)" />
            <path d="M12 2L21 7v6c0 5.25 -3.85 10.14 -9 11C14 20 16 15 12 2Z" fill="url(#shield-grad-2)" />
            <path d="M12 6l3 4-3 4-3-4z" fill="#ffffff" />
          </svg>
          Smart <span>Finance</span>
        </div>

        <h1 className="marketing-heading">
          Predict & Optimize Your Financial Horizon.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          A complete Fullstack Python application featuring Scikit-Learn predictions, compound projections, and custom MySQL database modeling.
        </p>

        <ul className="marketing-features">
          <li>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div>
              <strong>Decision Tree Goal Forecasting</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Backend ML classifier calculates goal success rates using age, DTI, and savings metrics.
              </p>
            </div>
          </li>
          <li>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div>
              <strong>Compound Interest Curve Projections</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Plots SVG growth charts comparing low (5%), moderate (9%), and aggressive (13%) risk levels.
              </p>
            </div>
          </li>
          <li>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div>
              <strong>Healthcare Asset Shield</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Custom rule-based recommendations suggesting Mediclaim protection covers to safeguard portfolio growth.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2 className="auth-title">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="auth-subtitle">
            {authMode === 'login'
              ? 'Sign in to access your financial predictions.'
              : 'Sign up to model and test your wealth goals.'
            }
          </p>

          <form onSubmit={handleAuthSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={authForm.username}
                onChange={e => setAuthForm({...authForm, username: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={authForm.password}
                onChange={e => setAuthForm({...authForm, password: e.target.value})}
                required
              />
            </div>

            {authMode === 'register' && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={authForm.confirmPassword}
                  onChange={e => setAuthForm({...authForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-neon" style={{ marginTop: '1rem' }}>
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-toggle">
            {authMode === 'login' ? (
              <>
                Don't have an account?
                <span className="auth-link" onClick={() => setAuthMode('register')}>
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?
                <span className="auth-link" onClick={() => setAuthMode('login')}>
                  Sign In
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
