import { useContext, useEffect, useState } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';
import { Heart, MessageCircle, UserPlus, Image as ImageIcon, Circle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PostDetailModal from '../components/Post/PostDetailModal';
import { AuthContext } from '../context/AuthContext';

export default function Notifications() {
  const { notifications, markAsRead } = useContext(NotificationContext);
  const { user: currentUser } = useContext(AuthContext);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  // Removed markAllRead from mount. User clicks individual notifications to mark read.

  const groupNotifications = () => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    notifications.forEach(notif => {
      const date = new Date(notif.createdAt);
      if (isToday(date)) groups.today.push(notif);
      else if (isYesterday(date)) groups.yesterday.push(notif);
      else if (isThisWeek(date)) groups.thisWeek.push(notif);
      else groups.older.push(notif);
    });

    return groups;
  };

  const groups = groupNotifications();

  const handleNotifClick = (e, notif) => {
    if (!notif.read) {
      markAsRead(notif._id);
    }
    
    // If it's a follow notification, maybe navigate to profile. 
    // The Link inside already handles profile nav, so we just mark read.
    // If it's a post, clicking the thumbnail already handles post click, 
    // but clicking the container could also open the post if we wanted.
  };

  const renderNotifItem = (notif) => {
    const Icon = notif.type === 'like' ? Heart : notif.type === 'comment' ? MessageCircle : notif.type === 'new_post' ? ImageIcon : UserPlus;
    const colorClass = notif.type === 'like' ? 'text-terracotta' : notif.type === 'comment' ? 'text-sage' : notif.type === 'new_post' ? 'text-terracotta' : 'text-charcoal';

    // Heart, MessageCircle, ImageIcon should be filled. UserPlus just thicker stroke.
    const isFilled = ['like', 'comment', 'new_post'].includes(notif.type);

    return (
      <div 
        key={notif._id} 
        className={`notif-full-item ${notif.read ? 'read' : 'unread'}`}
        onClick={(e) => handleNotifClick(e, notif)}
      >
        <div className="notif-full-avatar">
          <img src={notif.sender?.avatarUrl} alt={notif.sender?.displayName} />
          <div className={`notif-full-icon ${colorClass}`}>
            <Icon 
              size={18} 
              fill={isFilled ? 'currentColor' : 'none'} 
              strokeWidth={isFilled ? 0 : 2.5}
              style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.5))' }}
            />
          </div>
        </div>
        
        <div className="notif-full-content">
          <p>
            <Link to={`/${notif.sender?.username}`} className="notif-full-user">{notif.sender?.displayName}</Link>
            {' '}
            {notif.type === 'like' && 'liked your moment.'}
            {notif.type === 'comment' && 'commented on your moment.'}
            {notif.type === 'follow' && 'started following you.'}
            {notif.type === 'follow_request' && 'sent you a follow request.'}
            {notif.type === 'follow_accept' && 'accepted your follow request.'}
            {notif.type === 'new_post' && 'shared a new moment.'}
          </p>
          <span className="notif-full-time">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</span>
        </div>

        {notif.postId && (
          <div className="notif-full-thumb" onClick={(e) => handlePostClick(e, notif.postId)}>
            <img src={notif.postId.imageUrl} alt="Post thumbnail" />
          </div>
        )}

        {!notif.read && <Circle size={8} fill="var(--terracotta)" color="var(--terracotta)" className="unread-dot" />}
      </div>
    );
  };

  return (
    <div className="notifications-page slide-up">
      <h1 className="notif-page-title">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="notif-page-empty">
          <p>Your notification garden is quiet today.</p>
        </div>
      ) : (
        <div className="notif-groups">
          {groups.today.length > 0 && (
            <div className="notif-group">
              <h2>Today</h2>
              {groups.today.map(renderNotifItem)}
            </div>
          )}
          {groups.yesterday.length > 0 && (
            <div className="notif-group">
              <h2>Yesterday</h2>
              {groups.yesterday.map(renderNotifItem)}
            </div>
          )}
          {groups.thisWeek.length > 0 && (
            <div className="notif-group">
              <h2>This Week</h2>
              {groups.thisWeek.map(renderNotifItem)}
            </div>
          )}
          {groups.older.length > 0 && (
            <div className="notif-group">
              <h2>Older</h2>
              {groups.older.map(renderNotifItem)}
            </div>
          )}
        </div>
      )}

      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          currentUserId={currentUser?._id}
          onClose={() => setSelectedPost(null)}
        />
      )}

      <style jsx="true">{`
        .notifications-page {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          padding-bottom: var(--spacing-2xl);
        }
        .notif-page-title {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: var(--spacing-xl);
          color: var(--charcoal);
        }
        .notif-group h2 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--warm-taupe);
          margin: var(--spacing-lg) 0 var(--spacing-md);
        }
        .notif-full-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--cream);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-xs);
          transition: background 0.2s;
          position: relative;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .notif-full-item:hover {
          background: var(--sand);
        }
        .notif-full-item.unread {
          border-color: var(--mist);
          background: var(--cream-light);
        }
        .notif-full-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }
        .notif-full-avatar img {
          width: 100%;
          height: 100%;
          border-radius: var(--radius-organic);
          object-fit: cover;
        }
        .notif-full-icon {
          position: absolute;
          bottom: -4px;
          right: -4px;
          background: transparent;
          padding: 0;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
        }
        .notif-full-content {
          flex: 1;
        }
        .notif-full-user {
          font-weight: 600;
          color: var(--charcoal);
          text-decoration: none;
        }
        .notif-full-time {
          font-size: 0.8rem;
          color: var(--warm-taupe);
        }
        .notif-full-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .notif-full-thumb:hover {
          transform: scale(1.05);
        }
        .notif-full-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .unread-dot {
          position: absolute;
          right: 10px;
          top: 10px;
        }
        .notif-page-empty {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--warm-taupe);
          font-style: italic;
        }
        .text-terracotta { color: var(--terracotta); }
        .text-sage { color: var(--sage); }
        .text-charcoal { color: var(--charcoal); }
      `}</style>
    </div>
  );
}
