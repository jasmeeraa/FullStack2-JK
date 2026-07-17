import { useDispatch, useSelector } from 'react-redux';
import { addPlatform, removePlatform, selectPlatform } from './platformsSlice';
import { useState } from 'react';

function Platforms() {
  const dispatch = useDispatch();
  const { platforms, selectedPlatform } = useSelector((state) => state.platforms);
  const [newPlatform, setNewPlatform] = useState('');

  const handleAddPlatform = (e) => {
    e.preventDefault();
    if (!newPlatform.trim()) return;
    dispatch(addPlatform(newPlatform.trim()));
    dispatch(selectPlatform(newPlatform.trim()));
    setNewPlatform('');
  };

  return (
    <div className="platforms-section">
      <h2>Platforms</h2>
      <form className="platform-form" onSubmit={handleAddPlatform}>
        <input
          value={newPlatform}
          onChange={(e) => setNewPlatform(e.target.value)}
          placeholder="Add a platform"
        />
        <button type="submit">Add</button>
      </form>

      <ul className="platform-list">
        {platforms.map((platform) => (
          <li key={platform}>
            <button type="button" className={platform === selectedPlatform ? 'active' : ''} onClick={() => dispatch(selectPlatform(platform))}>
              {platform}
            </button>
            <button type="button" className="remove-btn" onClick={() => dispatch(removePlatform(platform))}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Platforms;
