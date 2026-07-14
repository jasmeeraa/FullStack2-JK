import React from 'react';
import PostComposer from './components/PostComposer.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Social Media Toolkit</p>
          <h1>Multi-Platform Post Composer</h1>
          <p className="subtitle">
            Create one post, publish to multiple platforms, and validate every platform instantly.
          </p>
        </div>
      </header>
      <main>
        <PostComposer />
      </main>
    </div>
  );
}

export default App;
