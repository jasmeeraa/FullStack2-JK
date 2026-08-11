import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { findUserByEmail, registerUser } from '../utils/userStorage';

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (findUserByEmail(formData.email)) {
      setError('A user with this email already exists.');
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    register(newUser);
    setSuccess('Registration successful. Redirecting to login...');

    setTimeout(() => {
      navigate('/login');
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register as User</h1>
        <p className="subtitle">Create a student account for this JWT experiment.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}

          <button type="submit" className="primary-btn">Register</button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
