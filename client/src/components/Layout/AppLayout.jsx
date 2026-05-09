import { useState, useContext } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Suggestions from './Suggestions';
import PostComposer from '../Post/PostComposer';
import LogoutModal from '../UI/LogoutModal';
import { AuthContext } from '../../context/AuthContext';
import { Home, LogOut } from 'lucide-react';

export default function AppLayout({ children }) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { pathname } = useLocation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isHome = pathname === '/';
  // Suggestions are only relevant for logged in users and on the home page
  const showSuggestions = !!user && pathname === '/';

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <div className={`app-layout ${showSuggestions ? 'has-right-sidebar' : ''}`}>
      <Sidebar onOpenComposer={() => setIsComposerOpen(true)} />
      
      <main className="main-content">
        <TopBar />
        
        {user && (
          <div className="corner-action-container">
            {isHome ? (
              <button className="corner-btn logout" onClick={() => setIsLogoutModalOpen(true)}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/" className="corner-btn home">
                <Home size={20} />
                <span>Home</span>
              </Link>
            )}
          </div>
        )}

        <div className="layout-content-wrapper">
          <div className="page-container">
            {children}
          </div>

          {showSuggestions && (
            <aside className="right-sidebar">
              <Suggestions />
            </aside>
          )}
        </div>
      </main>

      <PostComposer 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)} 
      />

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />

      <style jsx="true">{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 72px; /* Space for the fixed sidebar */
        }

        .main-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
        }

        .layout-content-wrapper {
          display: flex;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          justify-content: center;
        }

        .page-container {
          padding: var(--spacing-xl) var(--spacing-lg);
          max-width: 600px;
          flex: 1;
          min-width: 0;
        }

        .right-sidebar {
          width: 320px;
          padding: var(--spacing-xl) var(--spacing-md);
          display: block;
        }

        .corner-action-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 900;
        }

        .corner-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-xl);
          background: var(--cream);
          border: var(--border-medium);
          color: var(--charcoal);
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
        }

        .corner-btn:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--terracotta);
          color: var(--terracotta);
        }

        .corner-btn.logout:hover {
          background: var(--terracotta);
          color: var(--cream);
          border-color: var(--terracotta);
        }

        @media (max-width: 1000px) {
          .right-sidebar {
            display: none;
          }
          .layout-content-wrapper {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .app-layout {
            padding-left: 0;
          }
          .page-container {
            padding: var(--spacing-md);
          }
          .corner-action-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
