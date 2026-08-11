import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="landing-page">
      <div className="landing-card">
        <p className="eyebrow">Educational JWT Authentication Demo</p>
        <h1>JWT Authentication System</h1>
        <p className="subtitle">
          This project demonstrates JWT-based authentication and role-based authorization.
        </p>

        <div className="option-grid">
          <Link to="/login" className="option-card option-primary">
            User Login
          </Link>
          <Link to="/admin-login" className="option-card option-warning">
            Admin Login
          </Link>
          <Link to="/register" className="option-card option-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
