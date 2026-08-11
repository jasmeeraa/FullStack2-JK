import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const languageOptions = ['JavaScript', 'Python', 'C++', 'Java'];

export default function EditorPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('// Write code here\nconsole.log("Hello from the JWT lab!");');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    setOutput('Code execution simulated for this frontend-only experiment. No backend compiler is used.');
  };

  const handleClear = () => {
    setCode('');
    setOutput('Editor cleared.');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card editor-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Programming demo</p>
            <h1>Code Editor</h1>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>

        <div className="info-box success-box editor-user-box">
          <span className="label">Current User</span>
          <strong>{currentUser?.name || 'User'} · {currentUser?.role?.toUpperCase() || 'USER'}</strong>
        </div>

        <div className="editor-controls">
          <label htmlFor="language">Language</label>
          <select id="language" value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <textarea
          className="code-editor"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Write code here..."
        />

        <div className="btn-row">
          <button className="primary-btn" onClick={handleRun}>Run</button>
          <button className="secondary-btn" onClick={handleClear}>Clear</button>
        </div>

        <div className="output-panel">
          <h3>Output</h3>
          <pre>{output || 'No output yet.'}</pre>
        </div>
      </div>
    </div>
  );
}
