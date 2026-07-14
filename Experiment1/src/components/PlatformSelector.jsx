import React from 'react';
import { platformRules } from '../data/platformRules.js';

function PlatformSelector({ selectedPlatforms, onToggle }) {
  return (
    <div className="composer-card platform-card">
      <h2>Choose Platforms</h2>
      <div className="platform-grid">
        {Object.entries(platformRules).map(([key, rule]) => (
          <label key={key} className="platform-option">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes(key)}
              onChange={() => onToggle(key)}
            />
            <span className="platform-label">{rule.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PlatformSelector;
