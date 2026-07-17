import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import AddPost from './components/AddPost';
import Posts from './features/posts/Posts';
import Platforms from './features/platforms/Platforms';
import { fetchSamplePosts } from './features/posts/postsSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { posts, drafts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchSamplePosts());
  }, [dispatch]);

  return (
    <div className="app-shell">
      <Navbar />
      <Dashboard />
      {error ? <p className="error-message">{error}</p> : null}
      <div className="content-grid">
        <section className="panel">
          <AddPost />
          <Posts posts={posts} loading={loading} drafts={drafts} />
        </section>
        <aside className="panel">
          <Platforms />
        </aside>
      </div>
    </div>
  );
}

export default App;
