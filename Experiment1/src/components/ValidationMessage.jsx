import React from 'react';
import { platformRules } from '../data/platformRules.js';

const statusMap = {
  ready: { label: '✓', className: 'status-ready' },
  warning: { label: '⚠', className: 'status-warning' },
  error: { label: '✗', className: 'status-error' },
};

function ValidationMessage({ results }) {
  return (
    <div className="composer-card validation-card">
      <h2>Platform Status</h2>
      {results.length === 0 ? (
        <p className="muted">Select platforms and type a message to see live validation.</p>
      ) : (
        <div className="validation-list">
          {results.map((result) => {
            const platformLabel = platformRules[result.platform]?.label || result.platform;
            const status = statusMap[result.status] || statusMap.ready;
            return (
              <div key={result.platform} className={`validation-row ${status.className}`}>
                <span className="validation-icon">{status.label}</span>
                <div>
                  <strong>{platformLabel}</strong>
                  <p>{result.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ValidationMessage;
