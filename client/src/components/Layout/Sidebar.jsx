import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bell, User as UserIcon, PlusCircle, LogOut, Settings as SettingsIcon, Bookmark, UserCheck, Moon, Sun } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import Logo from '../UI/Logo';

export default function Sidebar({ onOpenComposer }) {
  const { pathname } = useLocation();
  const { user, darkMode, toggleDarkMode } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: UserCheck, label: 'Requests', path: '/follow-requests' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: UserIcon, label: 'Profile', path: `/${user?.username || 'profile'}` },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Logo size={32} color="var(--terracotta)" />
        </div>
        <span className="logo-text">Chirp.</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link 
              to={item.path} 
              key={item.label} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="unread-indicator"></span>
                )}
              </div>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className={`nav-item dark-toggle ${darkMode ? 'active' : ''}`} onClick={toggleDarkMode}>
          <div className="nav-icon">
            {darkMode ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
          </div>
          <span className="nav-label">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button className="nav-item create-trigger" onClick={onOpenComposer}>
          <div className="nav-icon">
            <PlusCircle size={24} strokeWidth={1.5} />
          </div>
          <span className="nav-label">Create</span>
        </button>
        
        {user && (
          <Link to={`/${user.username}`} className="nav-item profile-item">
            <div className="nav-icon">
              <img src={user.avatarUrl} alt="" className="sidebar-avatar" />
            </div>
            <span className="nav-label">Profile</span>
          </Link>
        )}
      </div>

      <style jsx="true">{`
        .sidebar {
          width: 72px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          padding: var(--spacing-xl) 0;
          display: flex;
          flex-direction: column;
          border-right: var(--border-light);
          background: var(--cream);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          overflow: hidden;
          box-sizing: border-box;
        }

        .sidebar:hover {
          width: 244px;
        }
        
        .sidebar-logo {
          height: 50px;
          display: flex;
          align-items: center;
          padding: 0;
          margin-bottom: var(--spacing-2xl);
          color: var(--terracotta);
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 72px;
        }

        .logo-text {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.2s;
          white-space: nowrap;
          color: var(--charcoal);
        }

        .sidebar:hover .logo-text {
          opacity: 1;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          height: 56px;
          padding: 0;
          margin: 0 8px;
          border-radius: var(--radius-organic);
          color: var(--charcoal);
          transition: background 0.2s;
          text-decoration: none;
          cursor: pointer;
          width: calc(100% - 16px);
        }

        .nav-item:hover {
          background-color: var(--mist);
        }

        .nav-item.active {
          color: var(--terracotta);
          background-color: var(--sand);
        }

        .nav-icon {
          width: 56px;
          min-width: 56px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: transform 0.2s;
          position: relative;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.05);
        }

        .unread-indicator {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 8px;
          height: 8px;
          background-color: var(--terracotta);
          border-radius: 50%;
          border: 2px solid var(--cream);
        }

        .nav-label {
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s;
          white-space: nowrap;
          margin-left: 0;
        }

        .sidebar:hover .nav-label {
          opacity: 1;
        }

        .sidebar-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--mist);
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
