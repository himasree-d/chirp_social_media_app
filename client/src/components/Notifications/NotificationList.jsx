import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationList({ isOpen, onClose, notifications = [] }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="notif-backdrop" onClick={onClose} />
      
      <div className={`notif-panel ${isOpen ? 'open' : ''}`}>
        <div className="notif-header">
          <h3>Notifications</h3>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <div className="notif-body">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <p>It's quiet here.</p>
            </div>
          ) : (
            <ul className="notif-list">
              {notifications.map(notif => (
                <li key={notif._id} className={`notif-item ${!notif.read ? 'unread' : ''}`}>
                  <img src={notif.sender?.avatarUrl} alt="" className="notif-avatar" />
                  <div className="notif-content">
                    <p>
                      <strong>{notif.sender?.displayName}</strong>{' '}
                      {notif.type === 'like' && 'liked your moment.'}
                      {notif.type === 'comment' && 'commented on your moment.'}
                      {notif.type === 'follow' && 'started following you.'}
                      {notif.type === 'new_post' && 'shared a new moment.'}
                    </p>
                    <span className="notif-time">{formatDistanceToNow(new Date(notif.createdAt))} ago</span>
                  </div>
                  {notif.postId && notif.postId.imageUrl && (
                    <img src={notif.postId.imageUrl} alt="" className="notif-post-thumb" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .notif-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
        }

        .notif-panel {
          position: fixed;
          top: 80px; /* Below topbar */
          right: var(--spacing-lg);
          width: 350px;
          max-height: 500px;
          background: var(--cream);
          border: var(--border-light);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          transform: translateY(-10px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .notif-panel.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: var(--border-light);
        }

        .notif-header h3 {
          font-family: var(--font-display);
          color: var(--charcoal);
          font-size: 1.5rem;
          margin: 0;
        }

        .notif-body {
          overflow-y: auto;
          max-height: 400px;
        }

        .empty-state {
          padding: var(--spacing-2xl) var(--spacing-lg);
          text-align: center;
          color: var(--warm-taupe);
          font-family: var(--font-display);
          font-style: italic;
          font-size: 1.2rem;
        }

        .notif-list {
          display: flex;
          flex-direction: column;
        }

        .notif-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: var(--border-light);
          transition: background 0.2s;
        }

        .notif-item:hover {
          background: var(--sand);
        }

        .notif-item.unread {
          background: rgba(212, 132, 106, 0.05); /* very subtle terracotta */
        }

        .notif-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-round);
          object-fit: cover;
        }

        .notif-content {
          flex-grow: 1;
          font-size: 0.9rem;
          line-height: 1.3;
        }

        .notif-time {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--warm-taupe);
          display: block;
          margin-top: 4px;
        }

        .notif-post-thumb {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .notif-panel {
            top: 0;
            right: 0;
            width: 100%;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
            transform: translateX(100%);
          }
          .notif-panel.open {
            transform: translateX(0);
          }
          .notif-backdrop {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
