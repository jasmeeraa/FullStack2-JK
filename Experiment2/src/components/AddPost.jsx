import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDraft, addPost } from '../features/posts/postsSlice';

function AddPost() {
  const dispatch = useDispatch();
  const { platforms, selectedPlatform } = useSelector((state) => state.platforms);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState(selectedPlatform);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const payload = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      platform: platform || selectedPlatform
    };
    dispatch(addPost(payload));
    setTitle('');
    setContent('');
    setPlatform(selectedPlatform);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const payload = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      platform: platform || selectedPlatform
    };
    dispatch(addDraft(payload));
    setTitle('');
    setContent('');
    setPlatform(selectedPlatform);
  };

  return (
    <form className="composer" onSubmit={handlePublish}>
      <h2>Create Post</h2>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
      </label>
      <label>
        Content
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post" />
      </label>
      <label>
        Platform
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          {platforms.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <div className="button-row">
        <button type="button" onClick={handleSaveDraft}>Save Draft</button>
        <button type="submit">Publish</button>
      </div>
    </form>
  );
}

export default AddPost;
