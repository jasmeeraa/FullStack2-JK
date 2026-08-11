import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { findUserByEmail, getUsers, saveUsers } from '../utils/userStorage';

export default function EditorDashboard() {
  const { currentUser, logout } = useAuth();
  const [users, setUsers] = useState(() => getUsers().filter((user) => user.role === 'user'));
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUsers(getUsers().filter((user) => user.role === 'user'));
  }, []);

  const totals = useMemo(() => ({
    totalUsers: users.length,
  }), [users]);

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    setMessage('');
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = (event) => {
    event.preventDefault();

    const existingUser = getUsers().find((user) => user.id === editingUserId);
    if (!existingUser || existingUser.role !== 'user') {
      setMessage('Only normal users can be edited by an editor.');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setMessage('Name, email, and password are required.');
      return;
    }

    if (findUserByEmail(formData.email) && findUserByEmail(formData.email).id !== existingUser.id) {
      setMessage('A user with this email already exists.');
      return;
    }

    const allUsers = getUsers();
    const updatedUsers = allUsers.map((user) => {
      if (user.id !== editingUserId) {
        return user;
      }

      return {
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };
    });

    saveUsers(updatedUsers);
    setUsers(updatedUsers.filter((user) => user.role === 'user'));
    setEditingUserId(null);
    setFormData({ name: '', email: '', password: '' });
    setMessage('User details updated successfully.');
  };

  return (
    <div className="dashboard-page admin-page">
      <div className="dashboard-card admin-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Editor – User Credential Management</p>
            <h1>Editor Dashboard</h1>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </div>

        <div className="info-grid user-grid">
          <div className="info-box success-box">
            <span className="label">Editor Name</span>
            <strong>{currentUser?.name || 'Editor'}</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Editor Email</span>
            <strong>{currentUser?.email || 'N/A'}</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Role</span>
            <strong>EDITOR</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Managed Users</span>
            <strong>{totals.totalUsers}</strong>
          </div>
        </div>

        {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

        <div className="table-panel">
          <h3>Manage User Credentials</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="secondary-btn" onClick={() => startEdit(user)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingUserId && (
          <div className="user-detail-panel">
            <h3>Edit User</h3>
            <form onSubmit={handleSave} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                />
              </div>

              <div className="btn-row">
                <button type="submit" className="primary-btn">Save Changes</button>
                <button type="button" className="secondary-btn" onClick={() => setEditingUserId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
