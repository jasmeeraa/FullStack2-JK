import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isTokenValid } from '../utils/jwt';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, currentUser, token, logout } = useAuth();
  const location = useLocation();

  if (!token || !isTokenValid(token)) {
    logout();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    if (currentUser.role === 'editor') {
      return <Navigate to="/editor-dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
