import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeToken, isTokenValid } from '../utils/jwt';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, token, logout } = useAuth();
  const [showToken, setShowToken] = useState(false);

  const decodedToken = useMemo(() => {
    if (!token) {
      return null;
    }

    return decodeToken(token);
  }, [token]);

  if (!currentUser || !token || !isTokenValid(token)) {
    logout();
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Authentication status</p>
            <h1>Welcome, {currentUser.name}</h1>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>

        <div className="info-grid">
          <div className="info-box">
            <span className="label">Email</span>
            <strong>{currentUser.email}</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Role</span>
            <strong>{currentUser.role === 'editor' ? 'Editor' : 'User'}</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Authentication Status</span>
            <strong>Authenticated</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Token Status</span>
            <strong>{isTokenValid(token) ? 'Valid' : 'Expired'}</strong>
          </div>
        </div>

        <div className="btn-row">
          <Link to="/editor" className="primary-btn button-link">Open Code Editor</Link>
          <button className="secondary-btn" onClick={() => setShowToken((value) => !value)}>
            {showToken ? 'Hide Token' : 'View Token'}
          </button>
        </div>

        {showToken && (
          <div className="token-panel">
            <h3>Simulated JWT</h3>
            <pre>{token}</pre>
            <div className="decoded-token">
              <h4>Decoded token</h4>
              <ul>
                <li><strong>User ID:</strong> {decodedToken?.userId || 'N/A'}</li>
                <li><strong>Name:</strong> {decodedToken?.name || 'N/A'}</li>
                <li><strong>Email:</strong> {decodedToken?.email || 'N/A'}</li>
                <li><strong>Role:</strong> {decodedToken?.role || 'N/A'}</li>
                <li><strong>Expiration:</strong> {decodedToken?.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : 'N/A'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
