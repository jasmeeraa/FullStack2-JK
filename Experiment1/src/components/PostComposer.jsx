import React, { useMemo, useState } from 'react';
import PlatformSelector from './PlatformSelector.jsx';
import CharacterCounter from './CharacterCounter.jsx';
import MediaUploader from './MediaUploader.jsx';
import ValidationMessage from './ValidationMessage.jsx';
import PublishButton from './PublishButton.jsx';
import { platformRules } from '../data/platformRules.js';
import { getValidationStatus } from '../utils/validators.js';

const initialSelected = ['twitter', 'linkedin'];

function PostComposer() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(initialSelected);
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const validationResults = useMemo(() => {
    return selectedPlatforms.map((platform) => getValidationStatus(platform, content, mediaFile));
  }, [content, selectedPlatforms, mediaFile]);

  const hasError = validationResults.some((result) => result.status === 'error');
  const canPublish = selectedPlatforms.length > 0 && !hasError && !loading;

  const handleTogglePlatform = (platformKey) => {
    setSelectedPlatforms((current) =>
      current.includes(platformKey)
        ? current.filter((key) => key !== platformKey)
        : [...current, platformKey]
    );
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    if (feedback.type) {
      setFeedback({ type: '', message: '' });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      setFeedback({ type: 'error', message: 'Unsupported media type. Use PNG, JPG, or MP4.' });
      return;
    }

    setMediaFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFeedback({ type: '', message: '' });
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setPreviewUrl('');
    setFeedback({ type: '', message: '' });
  };

  const handleClear = () => {
    setContent('');
    setSelectedPlatforms([]);
    handleRemoveMedia();
    setFeedback({ type: '', message: '' });
  };

  const handlePublish = () => {
    if (!canPublish) {
      setFeedback({ type: 'error', message: 'Fix platform errors before publishing.' });
      return;
    }

    setLoading(true);
    setFeedback({ type: '', message: '' });

    setTimeout(() => {
      setLoading(false);
      setFeedback({ type: 'success', message: 'Post published successfully!' });
      handleClear();
    }, 2000);
  };

  return (
    <section className="composer-grid">
      <div className="composer-card editor-card">
        <div className="editor-header">
          <h2>Write your post</h2>
          <p>Compose once, validate for every selected network.</p>
        </div>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Write your post content here..."
          rows="8"
          aria-label="Post content"
        />
        <CharacterCounter content={content} selectedPlatforms={selectedPlatforms} />
        <PublishButton disabled={!canPublish} loading={loading} onPublish={handlePublish} onClear={handleClear} />
        {feedback.message && (
          <div className={`toast ${feedback.type}`}>{feedback.message}</div>
        )}
      </div>

      <div className="composer-sidebar">
        <PlatformSelector selectedPlatforms={selectedPlatforms} onToggle={handleTogglePlatform} />
        <MediaUploader
          mediaFile={mediaFile}
          previewUrl={previewUrl}
          onFileChange={handleFileChange}
          onRemove={handleRemoveMedia}
        />
        <ValidationMessage results={validationResults} />
      </div>
    </section>
  );
}

export default PostComposer;
