import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, MessageCircle, Bookmark, Send, MoreHorizontal, Edit3, Trash2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import * as postAPI from '../../api/postAPI';
import { Spinner } from '../UI';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function PostDetailModal({ post: initialPost, currentUserId, onClose }) {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUserId) || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption);
  const [editTags, setEditTags] = useState(post.tags?.join(' ') || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const commentsEndRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const res = await postAPI.getComments(post._id);
      setComments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = async () => {
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

  const handleUpdatePost = async () => {
    setIsUpdating(true);
    try {
      const tagsArray = editTags.split(' ').filter(t => t.trim() !== '').map(t => t.replace('#', ''));
      const res = await postAPI.updatePost(post._id, {
        caption: editCaption,
        tags: tagsArray
      });
      setPost(res.data.data);
      setIsEditing(false);
      toast.success('Post updated!');
    } catch (err) {
      toast.error('Failed to update post');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this moment? This action cannot be undone.')) return;
    
    try {
      await postAPI.deletePost(post._id);
      toast.success('Post deleted');
      onClose();
      // Trigger a refresh of the parent list
      window.dispatchEvent(new CustomEvent('postDeleted', { detail: post._id }));
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await postAPI.addComment(post._id, newComment);
      setComments(prev => [...prev, res.data.data]);
      setNewComment('');
      // Scroll to bottom
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = currentUserId === (post.authorId._id || post.authorId);

  const modalContent = (
    <div className="post-detail-overlay" onClick={onClose}>
      <div className="post-detail-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn-outer" onClick={onClose}><X size={28} /></button>
        
        <div className="split-view">
          {/* Left: Image */}
          <div className="image-section">
            <img src={post.imageUrl} alt={post.caption} className="main-image" />
          </div>

          {/* Right: Info & Comments */}
          <div className="info-section">
            {/* Header */}
            <div className="author-header">
              <Link to={`/${post.authorId.username}`} className="author-link" onClick={onClose}>
                <img src={post.authorId.avatarUrl} alt="" className="author-avatar" />
                <div className="author-info">
                  <span className="author-name">{post.authorId.displayName}</span>
                  <span className="author-username">@{post.authorId.username}</span>
                </div>
              </Link>
              
              <div className="header-actions" ref={menuRef}>
                <button className="more-btn" onClick={() => setShowMenu(!showMenu)}>
                  <MoreHorizontal size={20} />
                </button>
                
                {showMenu && (
                  <div className="post-menu">
                    {isOwner ? (
                      <>
                        <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                          <Edit3 size={16} />
                          <span>Edit Post</span>
                        </button>
                        <button className="delete-btn" onClick={handleDeletePost}>
                          <Trash2 size={16} />
                          <span>Delete Post</span>
                        </button>
                      </>
                    ) : (
                      <button onClick={() => toast.success('Reported')}>Report Post</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comments Area (Scrollable) */}
            <div className="scroll-area">
              {/* Caption Area */}
              <div className="caption-box">
                <img src={post.authorId.avatarUrl} alt="" className="comment-avatar" />
                <div className="comment-body">
                  {isEditing ? (
                    <div className="edit-form">
                      <textarea 
                        className="edit-caption-input"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Write a caption..."
                      />
                      <input 
                        className="edit-tags-input"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="moods (e.g. calm happy)"
                      />
                      <div className="edit-actions">
                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="save-btn" onClick={handleUpdatePost} disabled={isUpdating}>
                          {isUpdating ? <Spinner size={14} /> : <Check size={16} />}
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>
                        <span className="comment-user">{post.authorId.displayName}</span>
                        {post.caption}
                      </p>
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="tags-container-inline">
                          {post.tags.map(tag => (
                            <span key={tag} className="detail-tag">#{tag.toLowerCase()}</span>
                          ))}
                        </div>
                      )}
                      <span className="comment-time">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="comments-divider" />

              {/* Actual Comments */}
              {isLoadingComments ? (
                <div className="loading-comments"><Spinner size={32} /></div>
              ) : (
                <div className="comments-list">
                  {comments.length === 0 ? (
                    <div className="no-comments">No comments yet. Be the first to say something!</div>
                  ) : (
                    comments.map(comment => (
                      <div key={comment._id} className="comment-item">
                        <img src={comment.authorId.avatarUrl} alt="" className="comment-avatar" />
                        <div className="comment-body">
                          <p>
                            <span className="comment-user">{comment.authorId.displayName}</span>
                            {comment.text}
                          </p>
                          <span className="comment-time">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>
              )}
            </div>

            {/* Actions & Input Footer */}
            <div className="footer-section">
              <div className="interaction-bar">
                <div className="left-actions">
                   <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="action-count">{likesCount}</span>
                  </button>
                  <button className="action-btn">
                    <MessageCircle size={24} />
                    <span className="action-count">{post.commentsCount || 0}</span>
                  </button>
                </div>
                <button className="action-btn"><Bookmark size={24} /></button>
              </div>

              <div className="stats-box">
                <span className="likes-bold">{likesCount} likes</span>
                <span className="time-small">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>

              <form className="comment-input-box" onSubmit={handleSubmitComment}>
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  disabled={isSubmitting}
                />
                <button 
                  type="submit" 
                  className="post-btn"
                  disabled={!newComment.trim() || isSubmitting}
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .post-detail-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .post-detail-content {
          background: var(--cream);
          width: 100%;
          max-width: 1100px;
          height: 85vh;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          display: flex;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .close-btn-outer {
          position: fixed;
          top: 20px;
          right: 20px;
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .close-btn-outer:hover {
          transform: scale(1.1);
        }

        .split-view {
          display: flex;
          width: 100%;
          height: 100%;
        }

        .image-section {
          flex: 1.4;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .info-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
          border-left: var(--border-light);
          min-width: 380px;
        }

        .author-header {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: var(--border-light);
          position: relative;
        }

        .author-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-name {
          font-weight: 700;
          color: var(--charcoal);
          font-size: 0.9rem;
          display: block;
        }

        .author-username {
          color: var(--warm-taupe);
          font-size: 0.75rem;
          display: block;
        }

        .header-actions {
          position: relative;
        }

        .more-btn {
          background: none;
          border: none;
          color: var(--charcoal);
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .more-btn:hover {
          background: #f0f0f0;
        }

        .post-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          width: 180px;
          z-index: 100;
          padding: 8px 0;
          overflow: hidden;
        }

        .post-menu button {
          width: 100%;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          font-size: 0.9rem;
          color: var(--charcoal);
          cursor: pointer;
          text-align: left;
        }

        .post-menu button:hover {
          background: #f8f8f8;
        }

        .post-menu .delete-btn {
          color: var(--terracotta);
        }

        .scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          scrollbar-width: none;
        }

        .scroll-area::-webkit-scrollbar {
          display: none;
        }

        .caption-box, .comment-item {
          display: flex;
          gap: 12px;
          margin-bottom: 18px;
        }

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .comment-body {
          flex: 1;
        }

        .comment-body p {
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--charcoal);
          word-break: break-word;
        }

        .comment-user {
          font-weight: 700;
          margin-right: 8px;
          color: var(--charcoal);
        }

        .comment-time {
          font-size: 0.75rem;
          color: var(--warm-taupe);
          display: block;
          margin-top: 4px;
        }

        .tags-container-inline {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 4px 0;
        }

        .detail-tag {
          color: #00376b;
          font-size: 0.9rem;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .edit-caption-input {
          width: 100%;
          min-height: 80px;
          padding: 8px;
          border: 1px solid var(--border-light);
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.9rem;
          resize: vertical;
        }

        .edit-tags-input {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--border-light);
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .edit-actions button {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cancel-btn {
          background: none;
          border: 1px solid var(--border-light);
          color: var(--warm-taupe);
        }

        .save-btn {
          background: var(--terracotta);
          color: white;
          border: none;
        }

        .comments-divider {
          height: 1px;
          background: var(--border-light);
          margin: 0 -16px 16px;
        }

        .footer-section {
          padding: 12px 16px;
          border-top: var(--border-light);
        }

        .interaction-bar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .left-actions {
          display: flex;
          gap: 16px;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: var(--charcoal);
          transition: transform 0.1s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-count {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .action-btn:active {
          transform: scale(0.9);
        }

        .action-btn.liked {
          color: #ed4956;
        }

        .stats-box {
          margin-bottom: 12px;
        }

        .likes-bold {
          font-weight: 700;
          font-size: 0.9rem;
          display: block;
        }

        .time-small {
          font-size: 0.7rem;
          color: var(--warm-taupe);
          text-transform: uppercase;
        }

        .comment-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 12px;
          border-top: var(--border-light);
          margin: 0 -16px -12px;
          padding: 12px 16px;
        }

        .comment-input-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.9rem;
          background: transparent;
        }

        .post-btn {
          background: none;
          border: none;
          color: var(--terracotta);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .post-btn:disabled {
          opacity: 0.3;
        }

        .loading-comments {
          display: flex;
          justify-content: center;
          padding: 40px;
        }

        .no-comments {
          text-align: center;
          padding: 40px 20px;
          color: var(--warm-taupe);
          font-style: italic;
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .post-detail-overlay {
            padding: 0;
          }
          .post-detail-content {
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
            flex-direction: column;
          }
          .split-view {
            flex-direction: column;
            overflow-y: auto;
          }
          .image-section {
            flex: none;
            height: auto;
            max-height: 50vh;
          }
          .main-image {
            height: auto;
            width: 100%;
          }
          .info-section {
            flex: 1;
            border-left: none;
            min-width: 0;
          }
          .close-btn-outer {
            color: var(--charcoal);
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.8);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
