import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateToken } from '../utils/jwt';
import { findUserByEmail } from '../utils/userStorage';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (currentUser.role === 'editor') {
      return <Navigate to="/editor-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required.');
      return;
    }

    const storedUser = findUserByEmail(formData.email);

    if (!storedUser || storedUser.password !== formData.password) {
      setError('Invalid email or password.');
      return;
    }

    if (storedUser.role === 'admin') {
      setError('Use the Admin Login page for administrator access.');
      return;
    }

    const authToken = generateToken({
      userId: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      role: storedUser.role,
    });

    login(
      {
        id: storedUser.id,
        userId: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role,
      },
      authToken
    );

    if (storedUser.role === 'editor') {
      navigate('/editor-dashboard');
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>User Login</h1>
        <p className="subtitle">Sign in to continue to your dashboard.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="message error">{error}</div>}

          <button type="submit" className="primary-btn">Login</button>
        </form>

        <p className="switch-text">
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
