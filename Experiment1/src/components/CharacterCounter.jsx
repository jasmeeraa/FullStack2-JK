import React from 'react';
import { getRemainingCharacters } from '../utils/validators.js';
import { platformRules } from '../data/platformRules.js';

function CharacterCounter({ content, selectedPlatforms }) {
  const activePlatforms = selectedPlatforms.length ? selectedPlatforms : Object.keys(platformRules);
  const remainingValues = activePlatforms.map((platform) => getRemainingCharacters(platform, content));
  const smallestRemaining = Math.min(...remainingValues);
  const maxLimits = activePlatforms.map((platform) => platformRules[platform].limit);
  const activeLimit = Math.min(...maxLimits);
  const length = content.trim().length;

  return (
    <div className="counter-panel">
      <div>
        <strong>{length}</strong> / {activeLimit} characters
      </div>
      <div className={smallestRemaining < 0 ? 'counter-status error' : smallestRemaining <= 20 ? 'counter-status warning' : 'counter-status ready'}>
        {smallestRemaining < 0
          ? `${Math.abs(smallestRemaining)} over limit for the strictest platform`
          : `${smallestRemaining} characters remaining for the strictest platform`}
      </div>
    </div>
  );
}

export default CharacterCounter;
