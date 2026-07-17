import { useDispatch, useSelector } from 'react-redux';
import { deletePost, publishDraft } from './postsSlice';

function Posts() {
  const dispatch = useDispatch();
  const { posts, drafts, loading } = useSelector((state) => state.posts);

  if (loading) {
    return <p className="status-text">Loading sample posts...</p>;
  }

  return (
    <div className="posts-section">
      <h2>Published Posts</h2>
      {posts.length === 0 ? <p className="status-text">No published posts yet.</p> : null}
      <div className="card-list">
        {posts.map((post) => (
          <article className="card" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <span className="tag">{post.platform}</span>
            <div className="card-actions">
              <button type="button" onClick={() => dispatch(deletePost(post.id))}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <h2>Drafts</h2>
      {drafts.length === 0 ? <p className="status-text">No drafts saved.</p> : null}
      <div className="card-list">
        {drafts.map((draft) => (
          <article className="card" key={draft.id}>
            <h3>{draft.title}</h3>
            <p>{draft.content}</p>
            <span className="tag">{draft.platform}</span>
            <div className="card-actions">
              <button type="button" onClick={() => dispatch(publishDraft(draft.id))}>Publish</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Posts;
