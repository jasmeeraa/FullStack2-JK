import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditorDashboard from './pages/EditorDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const { isAuthenticated, currentUser } = useAuth();

  const getDefaultPath = () => {
    if (!isAuthenticated || !currentUser) {
      return '/';
    }

    if (currentUser.role === 'admin') {
      return '/admin';
    }

    if (currentUser.role === 'editor') {
      return '/editor-dashboard';
    }

    return '/dashboard';
  };

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'editor', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['editor', 'admin']}>
              <EditorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={getDefaultPath()} replace />} />
      </Routes>
    </div>
  );
}
