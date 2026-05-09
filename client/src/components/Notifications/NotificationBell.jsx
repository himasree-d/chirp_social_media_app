import { useState } from 'react';

// Using a custom SVG to allow path animation for the liquid fill
export default function NotificationBell({ unreadCount, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      className="notification-bell-wrapper" 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bell-container">
        {/* Base outline bell */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="var(--charcoal)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="bell-outline"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {/* Liquid Fill bell - only visible if unreadCount > 0 */}
        {unreadCount > 0 && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" 
            viewBox="0 0 24 24" 
            fill="var(--terracotta)" 
            stroke="var(--terracotta)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="bell-fill animate-liquid-fill"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        )}
      </div>
      
      {/* Small dot indicator to ensure visibility even when liquid is animating from bottom */}
      {unreadCount > 0 && <span className="notification-dot" />}

      <style jsx="true">{`
        .notification-bell-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-round);
          transition: background-color 0.2s;
        }

        .notification-bell-wrapper:hover {
          background-color: var(--mist);
        }

        .bell-container {
          position: relative;
          width: 24px;
          height: 24px;
        }

        .bell-outline {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .bell-fill {
          position: absolute;
          inset: 0;
          z-index: 2;
          /* Clip path animation is defined in globals.css / animations.css */
        }

        .notification-dot {
          position: absolute;
          top: 6px;
          right: 8px;
          width: 8px;
          height: 8px;
          background-color: var(--terracotta);
          border-radius: var(--radius-round);
          border: 2px solid var(--cream);
          z-index: 3;
        }
      `}</style>
    </button>
  );
}
