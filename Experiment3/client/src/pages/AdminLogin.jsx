import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateToken } from '../utils/jwt';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated && currentUser) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/dashboard'} replace />;
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
      setError('Admin email and password are required.');
      return;
    }

    if (formData.email.trim().toLowerCase() !== 'admin@example.com' || formData.password !== 'admin123') {
      setError('Invalid administrator credentials.');
      return;
    }

    const token = generateToken({
      userId: 'admin-1',
      name: 'Administrator',
      email: 'admin@example.com',
      role: 'admin',
    });

    login({
      id: 'admin-1',
      userId: 'admin-1',
      name: 'Administrator',
      email: 'admin@example.com',
      role: 'admin',
    }, token);

    navigate('/admin');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Administrator Login</h1>
        <p className="subtitle">Secure administrator access for the JWT lab.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
            />
          </div>

          {error && <div className="message error">{error}</div>}

          <button type="submit" className="primary-btn">Login as Admin</button>
        </form>

        <p className="switch-text">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
