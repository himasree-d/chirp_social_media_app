import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send } from 'lucide-react';
import * as postAPI from '../../api/postAPI';
import { formatDistanceToNow } from 'date-fns';
import { Spinner } from '../UI';
import toast from 'react-hot-toast';

export default function CommentDrawer({ postId, isOpen, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await postAPI.getComments(postId);
      setComments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await postAPI.addComment(postId, newComment);
      setComments(prev => [res.data.data, ...prev]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const drawerContent = (
    <div className={`comment-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="comment-drawer" onClick={e => e.stopPropagation()}>
        <div className="comment-drawer-header">
          <h3>Comments</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div className="comment-list">
          {isLoading ? (
            <div className="loading-state"><Spinner /></div>
          ) : comments.length === 0 ? (
            <div className="empty-state">No comments yet. Be the first to lingering here.</div>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="comment-item">
                <img src={comment.authorId.avatarUrl} alt={comment.authorId.displayName} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-meta">
                    <span className="comment-user">{comment.authorId.displayName}</span>
                    <span className="comment-time">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="comment-input-area" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button type="submit" disabled={!newComment.trim() || isSubmitting}>
            {isSubmitting ? <Spinner size="sm" /> : <Send size={18} />}
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .comment-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
        }
        .comment-drawer {
          width: 100%;
          max-width: 450px;
          background: var(--cream);
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.3s ease-out;
          position: relative;
          z-index: 10000;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .comment-drawer-header {
          padding: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: var(--border-light);
        }
        .comment-drawer-header h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin: 0;
        }
        .comment-list {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-lg);
        }
        .comment-item {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        .comment-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-organic);
          object-fit: cover;
        }
        .comment-content {
          flex: 1;
        }
        .comment-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .comment-user {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--charcoal);
        }
        .comment-time {
          font-size: 0.75rem;
          color: var(--warm-taupe);
        }
        .comment-text {
          font-size: 0.95rem;
          color: var(--charcoal);
          line-height: 1.4;
        }
        .comment-input-area {
          padding: var(--spacing-lg);
          display: flex;
          gap: var(--spacing-md);
          border-top: var(--border-light);
          background: var(--sand);
        }
        .comment-input-area input {
          flex: 1;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-organic);
          border: var(--border-medium);
          background: var(--cream);
          outline: none;
        }
        .comment-input-area button {
          color: var(--terracotta);
          transition: transform 0.2s;
        }
        .comment-input-area button:disabled {
          color: var(--warm-taupe);
        }
        .loading-state, .empty-state {
          display: flex;
          justify-content: center;
          padding: var(--spacing-2xl);
          color: var(--warm-taupe);
          text-align: center;
          font-style: italic;
        }
        @media (max-width: 768px) {
          .comment-drawer-overlay {
            align-items: flex-end;
          }
          .comment-drawer {
            height: 80vh;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
            animation: slideInUp 0.3s ease-out;
          }
          @keyframes slideInUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        }
      `}</style>
    </div>
  );

  return createPortal(drawerContent, document.body);
}
