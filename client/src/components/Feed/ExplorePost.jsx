import { useState, useContext } from 'react';
import PostDetailModal from '../Post/PostDetailModal';
import { AuthContext } from '../../context/AuthContext';

export default function ExplorePost({ post, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleClose = () => {
    setIsModalOpen(false);
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <div className="explore-post-card" onClick={() => setIsModalOpen(true)}>
        <img src={post.imageUrl} alt={post.caption} className="explore-post-image" />
        <div className="explore-post-overlay">
          <div className="overlay-stats">
            <span>❤️ {post.likes?.length || 0}</span>
            <span>💬 {post.commentsCount || 0}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PostDetailModal 
          post={post} 
          currentUserId={user?._id}
          onClose={handleClose} 
        />
      )}

      <style jsx="true">{`
        .explore-post-card {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 1;
        }

        .explore-post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .explore-post-card:hover .explore-post-image {
          transform: scale(1.05);
        }

        .explore-post-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .explore-post-card:hover .explore-post-overlay {
          opacity: 1;
        }

        .overlay-stats {
          color: white;
          display: flex;
          gap: var(--spacing-md);
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
