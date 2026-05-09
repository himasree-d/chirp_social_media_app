import { useState, useEffect } from 'react';
import { X, User, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as userAPI from '../../api/userAPI';
import toast from 'react-hot-toast';

export default function FollowListModal({ isOpen, onClose, type, userId, title, isOwnFollowers }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = type === 'followers' 
          ? await userAPI.getFollowers(userId) 
          : await userAPI.getFollowing(userId);
        setUsers(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load list');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, type, userId]);

  if (!isOpen) return null;

  const handleRemoveFollower = async (followerId) => {
    setRemovingId(followerId);
    try {
      await userAPI.removeFollower(followerId);
      setUsers(prev => prev.filter(u => u._id !== followerId));
      toast.success('Follower removed');
    } catch (err) {
      toast.error('Failed to remove follower');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div className="follow-modal-content slide-up" onClick={e => e.stopPropagation()}>
        <div className="follow-modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div className="follow-modal-body">
          {isLoading ? (
            <div className="modal-loading">Finding connections...</div>
          ) : error ? (
            <div className="modal-error">{error}</div>
          ) : users.length === 0 ? (
            <div className="modal-empty">Nothing here yet.</div>
          ) : (
            <ul className="user-list">
              {users.map(user => (
                <li key={user._id} className="user-item">
                  <Link to={`/${user.username}`} className="user-link" onClick={onClose}>
                    <div className="user-avatar">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.displayName} />
                      ) : (
                        <div className="avatar-placeholder"><User size={20} /></div>
                      )}
                    </div>
                    <div className="user-info">
                      <span className="display-name">{user.displayName}</span>
                      <span className="username">@{user.username}</span>
                    </div>
                  </Link>
                  {isOwnFollowers && (
                    <button
                      className="remove-follower-btn"
                      onClick={() => handleRemoveFollower(user._id)}
                      disabled={removingId === user._id}
                      title="Remove follower"
                    >
                      {removingId === user._id ? '...' : <UserMinus size={16} />}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .follow-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: var(--spacing-md);
        }

        .follow-modal-content {
          background: var(--cream);
          width: 100%;
          max-width: 400px;
          border-radius: var(--radius-lg);
          border: var(--border-light);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          max-height: 80vh;
        }

        .follow-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: var(--border-light);
        }

        .follow-modal-header h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin: 0;
          color: var(--charcoal);
        }

        .close-btn {
          color: var(--warm-taupe);
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: var(--charcoal);
        }

        .follow-modal-body {
          overflow-y: auto;
          padding: var(--spacing-sm) 0;
        }

        .user-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .user-item {
          display: flex;
          align-items: center;
          transition: background 0.2s;
        }

        .user-item:hover {
          background: var(--sand);
        }

        .remove-follower-btn {
          flex-shrink: 0;
          margin-right: var(--spacing-md);
          padding: 6px;
          color: var(--warm-taupe);
          background: none;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }

        .remove-follower-btn:hover {
          color: var(--terracotta);
          background: var(--mist);
        }

        .remove-follower-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .user-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          text-decoration: none;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-round);
          overflow: hidden;
          background: var(--mist);
          flex-shrink: 0;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--warm-taupe);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .display-name {
          font-weight: 600;
          color: var(--charcoal);
          font-size: 0.95rem;
        }

        .username {
          color: var(--warm-taupe);
          font-size: 0.8rem;
          font-family: var(--font-mono);
        }

        .modal-loading, .modal-empty, .modal-error {
          padding: var(--spacing-2xl);
          text-align: center;
          color: var(--warm-taupe);
          font-style: italic;
        }

        .modal-error {
          color: var(--terracotta);
        }
      `}</style>
    </div>
  );
}
