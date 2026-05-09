import { Bell } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../Notifications/NotificationBell';
import NotificationList from '../Notifications/NotificationList';
import { NotificationContext } from '../../context/NotificationContext';

export default function TopBar() {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount, markAllRead } = useContext(NotificationContext);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleToggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
  };

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <h2>Chirp.</h2>
      </div>
      
      <div className="topbar-actions">
        <NotificationBell 
          unreadCount={unreadCount} 
          onClick={handleToggleNotif} 
        />
        <NotificationList 
          isOpen={isNotifOpen} 
          onClose={() => setIsNotifOpen(false)} 
          notifications={notifications}
          onMarkRead={markAllRead} 
        />
        {user && (
          <img 
            src={user.avatarUrl} 
            alt={user.displayName} 
            className="avatar-sm"
          />
        )}
      </div>

      <style jsx="true">{`
        .topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) var(--spacing-lg);
          background-color: rgba(250, 247, 242, 0.9);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: var(--border-light);
        }

        .topbar-logo h2 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--terracotta);
          margin: 0;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .avatar-sm {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-round);
          object-fit: cover;
          border: 2px solid var(--sand);
        }

        @media (max-width: 768px) {
          .topbar {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
