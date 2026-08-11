import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteUser, findUserByEmail, getUsers, saveUsers, updateUser } from '../utils/userStorage';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const [users, setUsers] = useState(() => getUsers());
  const [selectedUser, setSelectedUser] = useState(null);
  const [editorForm, setEditorForm] = useState({ name: '', email: '', password: '' });
  const [editorMessage, setEditorMessage] = useState('');
  const [editForm, setEditForm] = useState({ id: null, name: '', email: '', password: '', role: '' });
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.filter((entry) => entry.role === 'user').length;
    const totalAdmins = users.filter((entry) => entry.role === 'admin').length;
    const totalEditors = users.filter((entry) => entry.role === 'editor').length;

    return {
      totalUsers,
      totalAdmins,
      totalEditors,
    };
  }, [users]);

  const refreshUsers = () => setUsers(getUsers());

  const handleDeleteUser = (userId) => {
    const currentId = currentUser?.userId || currentUser?.id;
    const targetUser = users.find((entry) => entry.id === userId);

    if (!targetUser) {
      return;
    }

    if (targetUser.role === 'admin' && targetUser.id === currentId) {
      setEditMessage('You cannot delete the currently logged-in Admin.');
      return;
    }

    deleteUser(userId);
    refreshUsers();
    setSelectedUser(null);
  };

  const handleCreateEditor = (event) => {
    event.preventDefault();
    setEditorMessage('');

    if (!editorForm.name.trim() || !editorForm.email.trim() || !editorForm.password.trim()) {
      setEditorMessage('Name, email, and password are required.');
      return;
    }

    if (findUserByEmail(editorForm.email)) {
      setEditorMessage('An account with this email already exists.');
      return;
    }

    const newEditor = {
      id: crypto.randomUUID(),
      name: editorForm.name.trim(),
      email: editorForm.email.trim(),
      password: editorForm.password,
      role: 'editor',
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...getUsers(), newEditor];
    saveUsers(nextUsers);
    setUsers(nextUsers);
    setEditorForm({ name: '', email: '', password: '' });
    setEditorMessage('Editor created successfully.');
  };

  const startEdit = (user) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    setEditMessage('');
  };

  const handleEditSave = (event) => {
    event.preventDefault();
    setEditMessage('');

    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.password.trim()) {
      setEditMessage('Name, email, and password are required.');
      return;
    }

    const existingUser = getUsers().find((user) => user.email.toLowerCase() === editForm.email.trim().toLowerCase());
    if (existingUser && existingUser.id !== editForm.id) {
      setEditMessage('A user with this email already exists.');
      return;
    }

    updateUser(editForm.id, {
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      password: editForm.password,
      role: editForm.role,
    });

    refreshUsers();
    setEditForm({ id: null, name: '', email: '', password: '', role: '' });
    setEditMessage('User details updated successfully.');
  };

  return (
    <div className="dashboard-page admin-page">
      <div className="dashboard-card admin-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Administrator Access</p>
            <h1>Admin Dashboard</h1>
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
            <span className="label">Administrator</span>
            <strong>{currentUser?.name || 'Administrator'}</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Email</span>
            <strong>{currentUser?.email || 'N/A'}</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Role</span>
            <strong>ADMIN</strong>
          </div>
          <div className="info-box success-box">
            <span className="label">Access</span>
            <strong>Full access</strong>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <span>Total Users</span>
            <strong>{stats.totalUsers}</strong>
          </div>
          <div className="stat-box">
            <span>Total Editors</span>
            <strong>{stats.totalEditors}</strong>
          </div>
          <div className="stat-box">
            <span>Total Admins</span>
            <strong>{stats.totalAdmins}</strong>
          </div>
        </div>

        <div className="admin-content">
          <div className="table-panel">
            <h3>All Users</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.name}</td>
                      <td>{entry.email}</td>
                      <td>{entry.role}</td>
                      <td className="action-cell">
                        <button className="secondary-btn" onClick={() => setSelectedUser(entry)}>
                          View
                        </button>
                        <button className="secondary-btn" onClick={() => startEdit(entry)}>
                          Edit
                        </button>
                        {!(entry.role === 'admin' && (entry.id === currentUser?.userId || entry.id === currentUser?.id)) && (
                          <button className="danger-btn" onClick={() => handleDeleteUser(entry.id)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedUser && (
            <div className="user-detail-panel">
              <h3>User Details</h3>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
            </div>
          )}
        </div>

        <div className="table-panel">
          <h3>Create Editor</h3>
          <form onSubmit={handleCreateEditor} className="auth-form">
            <div className="form-group">
              <label htmlFor="editorName">Name</label>
              <input
                id="editorName"
                type="text"
                value={editorForm.name}
                onChange={(event) => setEditorForm({ ...editorForm, name: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="editorEmail">Email</label>
              <input
                id="editorEmail"
                type="email"
                value={editorForm.email}
                onChange={(event) => setEditorForm({ ...editorForm, email: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="editorPassword">Password</label>
              <input
                id="editorPassword"
                type="password"
                value={editorForm.password}
                onChange={(event) => setEditorForm({ ...editorForm, password: event.target.value })}
              />
            </div>

            {editorMessage && <div className={`message ${editorMessage.includes('successfully') ? 'success' : 'error'}`}>{editorMessage}</div>}

            <button type="submit" className="primary-btn">Create Editor</button>
          </form>
        </div>

        {editForm.id && (
          <div className="user-detail-panel">
            <h3>Edit User Details</h3>
            <form onSubmit={handleEditSave} className="auth-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(event) => setEditForm({ ...editForm, password: event.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={editForm.role}
                  disabled
                />
              </div>

              {editMessage && <div className={`message ${editMessage.includes('successfully') ? 'success' : 'error'}`}>{editMessage}</div>}

              <div className="btn-row">
                <button type="submit" className="primary-btn">Save</button>
                <button type="button" className="secondary-btn" onClick={() => setEditForm({ id: null, name: '', email: '', password: '', role: '' })}>
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
