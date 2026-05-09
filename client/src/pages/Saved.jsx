import { useState, useEffect, useContext } from 'react';
import Masonry from 'react-masonry-css';
import FeedPost from '../components/Feed/FeedPost';
import { Spinner } from '../components/UI';
import * as postAPI from '../api/postAPI';
import { AuthContext } from '../context/AuthContext';

export default function Saved() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const breakpointColumnsObj = {
    default: 1,
    1100: 2,
  };

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await postAPI.getSavedPosts();
        setPosts(res.data.data);
      } catch (err) {
        console.error('Failed to fetch saved posts', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <div className="saved-page slide-up">
      <div className="saved-header">
        <h1>Saved Posts</h1>
        <p>Your private collection of inspiration.</p>
      </div>

      {isLoading ? (
        <div className="saved-loading">
          <Spinner />
          <p>Retrieving your collection...</p>
        </div>
      ) : posts.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts.map(post => (
            <FeedPost 
              key={post._id} 
              post={post} 
              currentUserId={user?._id} 
            />
          ))}
        </Masonry>
      ) : (
        <div className="saved-empty">
          <p>You haven't saved any posts yet.</p>
        </div>
      )}

      <style jsx="true">{`
        .saved-page {
          padding-bottom: var(--spacing-2xl);
        }
        .saved-header {
          margin-bottom: var(--spacing-xl);
          text-align: center;
        }
        .saved-header h1 {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--terracotta);
          margin-bottom: var(--spacing-xs);
        }
        .saved-header p {
          color: var(--warm-taupe);
          font-size: 1.1rem;
        }
        .saved-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-2xl);
          color: var(--warm-taupe);
        }
        .saved-empty {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--warm-taupe);
          font-style: italic;
        }

        /* Masonry Grid */
        :global(.my-masonry-grid) {
          display: flex;
          margin-left: -20px;
          width: auto;
        }
        :global(.my-masonry-grid_column) {
          padding-left: 20px;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
}
