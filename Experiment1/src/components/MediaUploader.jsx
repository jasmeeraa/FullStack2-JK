import React from 'react';

function MediaUploader({ mediaFile, previewUrl, onFileChange, onRemove }) {
  return (
    <div className="composer-card media-card">
      <div className="media-header">
        <h2>Media Upload</h2>
        <span className="hint">PNG, JPG, JPEG, MP4</span>
      </div>
      <label className="upload-button">
        <input type="file" accept="image/png,image/jpeg,image/jpg,video/mp4" onChange={onFileChange} />
        Upload Media
      </label>
      {mediaFile && (
        <div className="media-preview-card">
          {previewUrl && mediaFile.type.startsWith('image/') ? (
            <img src={previewUrl} alt="preview" className="preview-media" />
          ) : (
            <video controls className="preview-media">
              <source src={previewUrl} type={mediaFile.type} />
            </video>
          )}
          <div className="media-info">
            <p>{mediaFile.name}</p>
            <button type="button" className="text-button" onClick={onRemove}>
              Remove media
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUploader;
