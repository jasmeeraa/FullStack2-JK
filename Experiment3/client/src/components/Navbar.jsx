import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderLoggedOutLinks = () => (
    <>
      <Link to="/">Home</Link>
      <Link to="/login">User Login</Link>
      <Link to="/admin-login">Admin Login</Link>
      <Link to="/register">Register</Link>
    </>
  );

  const renderLoggedInLinks = () => {
    if (currentUser?.role === 'admin') {
      return (
        <>
          <Link to="/admin">Admin Dashboard</Link>
          <span className="user-badge">{currentUser.name} · ADMIN</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      );
    }

    if (currentUser?.role === 'editor') {
      return (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/editor-dashboard">Editor Dashboard</Link>
          <span className="user-badge">{currentUser.name} · EDITOR</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      );
    }

    return (
      <>
        <Link to="/dashboard">Dashboard</Link>
        <span className="user-badge">{currentUser?.name || 'User'} · USER</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">JWT Authentication System</div>
      <div className="nav-actions">
        {!isAuthenticated ? renderLoggedOutLinks() : renderLoggedInLinks()}
      </div>
    </nav>
  );
}
