import { useSelector } from 'react-redux';

function Dashboard() {
  const { posts, drafts } = useSelector((state) => state.posts);
  const { platforms } = useSelector((state) => state.platforms);

  return (
    <section className="dashboard">
      <div className="stat-card">
        <h3>Total Posts</h3>
        <p>{posts.length}</p>
      </div>
      <div className="stat-card">
        <h3>Total Drafts</h3>
        <p>{drafts.length}</p>
      </div>
      <div className="stat-card">
        <h3>Total Platforms</h3>
        <p>{platforms.length}</p>
      </div>
    </section>
  );
}

export default Dashboard;
