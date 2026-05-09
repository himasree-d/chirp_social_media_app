import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Clock } from 'lucide-react';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import * as postAPI from '../../api/postAPI';
import PostDetailModal from '../Post/PostDetailModal';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function FeedPost({ post, currentUserId }) {
  const { user, setUser } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUserId) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [lingerCount, setLingerCount] = useState(post.lingerers?.length || 0);
  const [showBurst, setShowBurst] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  
  // Robust check for saved status
  const isSaved = user?.savedPosts?.some(id => 
    (typeof id === 'string' ? id : id._id || id).toString() === post._id.toString()
  );
  
  const postRef = useRef(null);
  const lingerTimerRef = useRef(null);
  const hasLingeredRef = useRef(post.lingerers?.includes(currentUserId));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLingeredRef.current && currentUserId) {
          lingerTimerRef.current = setTimeout(async () => {
            try {
              await postAPI.trackLinger(post._id);
              setLingerCount(prev => prev + 1);
              hasLingeredRef.current = true;
            } catch (err) {
              console.error('Failed to track linger', err);
            }
          }, 3000);
        } else {
          if (lingerTimerRef.current) clearTimeout(lingerTimerRef.current);
        }
      },
      { threshold: 0.8 }
    );

    if (postRef.current) observer.observe(postRef.current);
    return () => {
      if (postRef.current) observer.unobserve(postRef.current);
      if (lingerTimerRef.current) clearTimeout(lingerTimerRef.current);
    };
  }, [post._id, currentUserId]);

  const rippleHoursLeft = (() => {
    if (post.visibility !== 'ripple') return null;
    const hoursPassed = differenceInHours(new Date(), new Date(post.createdAt));
    const hoursLeft = 48 - hoursPassed;
    return hoursLeft > 0 ? hoursLeft : 0;
  })();

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }
  };

  const handleLike = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      if (newLikedState) await postAPI.likePost(post._id);
      else await postAPI.unlikePost(post._id);
    } catch (err) {
      setIsLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!user) {
      toast.error('Please log in to save posts');
      return;
    }

    try {
      let newSavedPosts;
      if (isSaved) {
        const res = await postAPI.unsavePost(post._id);
        newSavedPosts = res.data.data;
        toast.success('Removed from saved');
      } else {
        const res = await postAPI.savePost(post._id);
        newSavedPosts = res.data.data;
        toast.success('Post saved!');
      }
      
      setUser({ ...user, savedPosts: newSavedPosts });
    } catch (err) {
      console.error('Failed to toggle save', err);
      toast.error('Failed to update saved posts');
    }
  };

  const cleanTag = (tag) => {
    if (!tag) return '';
    // Remove emojis, brackets, single/double quotes
    return tag
      .replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '')
      .replace(/[\[\]'"]/g, '')
      .trim();
  };

  return (
    <article className="post-card fade-in" ref={postRef}>
      <div className="post-header">
        <Link to={`/${post.authorId?.username}`} className="post-author-row">
          <img src={post.authorId?.avatarUrl} alt="" className="author-avatar-small" />
          <div className="author-text-meta">
            <span className="author-handle-top">@{post.authorId?.username}</span>
            {post.isRecommended && <span className="recommended-badge">Recommended</span>}
          </div>
        </Link>
      </div>

      <div className="post-image-container" onDoubleClick={handleDoubleTap}>
        <img src={post.imageUrl} alt="" className="post-image" />
        {rippleHoursLeft !== null && (
          <div className="ripple-badge">
            <Clock size={12} />
            <span>Fades in {rippleHoursLeft}h</span>
          </div>
        )}
        {showBurst && (
          <div className="burst-heart">
            <Heart fill="var(--terracotta)" size={80} />
          </div>
        )}
      </div>

      <div className="post-actions">
        <div className="action-group">
          <button className={`action-btn like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            <Heart fill={isLiked ? 'currentColor' : 'none'} size={22} />
            <span className="action-count">{likesCount}</span>
          </button>
          <button className="action-btn" onClick={() => setIsCommentOpen(true)}>
            <MessageCircle size={22} />
            <span className="action-count">{post.commentsCount || 0}</span>
          </button>
        </div>
        <div className="action-right">
          <button 
            className={`action-btn save-btn ${isSaved ? 'saved' : ''}`} 
            onClick={handleSave}
          >
            <Bookmark fill={isSaved ? 'currentColor' : 'none'} size={22} />
          </button>
        </div>
      </div>

      {lingerCount > 0 && (
        <div className="post-stats-row">
          <div className="post-stats">
            <span className="linger-count">{lingerCount} lingered</span>
          </div>
        </div>
      )}

      <div className="post-content">
        <Link to={`/${post.authorId?.username}`} className="post-display-name">
          {post.authorId?.displayName}
        </Link>
        <p className="post-caption-text">{post.caption}</p>
        <div className="post-tags">
          {post.tags?.map(tag => {
            const cleaned = cleanTag(tag);
            if (!cleaned) return null;
            return <span key={tag} className="post-tag">{cleaned.toLowerCase()}</span>;
          })}
        </div>
        <button className="view-comments" onClick={() => setIsCommentOpen(true)}>
          View all {post.commentsCount} comments
        </button>
        <div className="post-time">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </div>
      </div>

      {isCommentOpen && (
        <PostDetailModal 
          post={post} 
          currentUserId={currentUserId} 
          onClose={() => setIsCommentOpen(false)} 
        />
      )}

      <style jsx="true">{`
        .post-card {
          background-color: var(--cream);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: var(--spacing-xl);
          position: relative;
          box-shadow: var(--shadow-sm);
          z-index: 1;
        }

        .post-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: var(--texture-noise);
          opacity: 0.4;
          pointer-events: none;
          z-index: 10;
        }

        .post-image-container {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          display: block;
          object-fit: cover;
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md) var(--spacing-md) 4px;
          position: relative;
          z-index: 20;
        }

        .action-group {
          display: flex;
          gap: var(--spacing-md);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 40px;
          padding: 0 8px;
          color: var(--charcoal);
          transition: all 0.2s;
          background: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          pointer-events: auto;
        }

        .action-count {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .action-btn:hover {
          transform: scale(1.1);
          color: var(--terracotta);
        }

        .action-btn.liked, .action-btn.saved {
          color: var(--terracotta);
        }

        .post-stats-row {
          padding: 0 var(--spacing-md) 8px;
        }

        .post-stats {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--charcoal);
        }

        .post-content {
          padding: 0 var(--spacing-md) var(--spacing-md);
        }

        .post-display-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--charcoal);
          margin-right: 8px;
          text-decoration: none;
        }

        .post-caption-text {
          font-size: 0.95rem;
          line-height: 1.4;
          color: var(--charcoal);
          display: inline;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin: 8px 0;
        }

        .post-tag {
          background-color: var(--sage);
          color: var(--charcoal);
          padding: 2px 10px;
          border-radius: var(--radius-organic);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .view-comments {
          color: var(--warm-taupe);
          font-size: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 4px;
          display: block;
        }

        .post-time {
          color: var(--warm-taupe);
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .author-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--sand);
        }

        .author-handle-top {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .recommended-badge {
          font-size: 0.7rem;
          color: var(--terracotta);
          border: 1px solid var(--terracotta);
          padding: 2px 6px;
          border-radius: var(--radius-organic);
          margin-left: 8px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .post-header {
          padding: 12px 16px;
        }

        .post-author-row {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }

        .ripple-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.8);
          padding: 4px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--terracotta);
        }
      `}</style>
    </article>
  );
}
