import React from 'react';

function PublishButton({ disabled, loading, onPublish, onClear }) {
  return (
    <div className="action-row">
      <button
        type="button"
        className="primary-button"
        disabled={disabled || loading}
        onClick={onPublish}
      >
        {loading ? 'Publishing...' : 'Publish'}
      </button>
      <button type="button" className="secondary-button" onClick={onClear} disabled={loading}>
        Clear
      </button>
    </div>
  );
}

export default PublishButton;
