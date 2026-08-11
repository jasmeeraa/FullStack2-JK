import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchProfile = async () => {
    if (!token) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch user profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Authentication status</p>
            <h1>Welcome, {user?.name || 'User'}</h1>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="info-grid">
          <div className="info-box">
            <span className="label">User email</span>
            <strong>{user?.email || 'N/A'}</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Authentication status</span>
            <strong>Authenticated</strong>
          </div>
        </div>

        <button className="primary-btn" onClick={fetchProfile} disabled={isLoading}>
          {isLoading ? 'Fetching profile...' : 'Fetch protected user information'}
        </button>

        {error && <div className="message error">{error}</div>}

        {profile && (
          <div className="profile-panel">
            <h3>Protected user data</h3>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>ID:</strong> {profile.id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
