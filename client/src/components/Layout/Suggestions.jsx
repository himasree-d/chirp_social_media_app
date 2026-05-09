import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as userAPI from '../../api/userAPI';
import { Spinner } from '../UI';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await userAPI.getSuggestions();
        setSuggestions(res.data.data);
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (isLoading) return <div className="suggestions-loading"><Spinner size={20} /></div>;
  if (suggestions.length === 0) return null;

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <h3>Suggestions for you</h3>
      </div>
      
      <div className="suggestions-list">
        {suggestions.map(user => (
          <div key={user._id} className="suggestion-item">
            <Link to={`/${user.username}`} className="suggestion-link">
              <img src={user.avatarUrl} alt={user.displayName} className="suggestion-avatar" />
              <div className="suggestion-info">
                <span className="suggestion-name">{user.displayName}</span>
                <span className="suggestion-username">@{user.username}</span>
              </div>
            </Link>
            <Link to={`/${user.username}`} className="view-btn">View</Link>
          </div>
        ))}
      </div>

      {/* Trending Moods Section */}
      <div className="trending-section">
        <div className="suggestions-header">
          <h3>Trending Moods</h3>
        </div>
        <div className="trending-list">
          <Link to="/explore?mood=Calm" className="trending-item">
            <span className="trending-tag"># Calm</span>
            <span className="trending-count">2.4k moments</span>
          </Link>
          <Link to="/explore?mood=Inspired" className="trending-item">
            <span className="trending-tag"># Inspired</span>
            <span className="trending-count">1.8k moments</span>
          </Link>
          <Link to="/explore?mood=Reflective" className="trending-item">
            <span className="trending-tag"># Reflective</span>
            <span className="trending-count">1.2k moments</span>
          </Link>
        </div>
        <Link to="/explore" className="show-more-link">Show more</Link>
      </div>

      <style jsx="true">{`
        .suggestions-container {
          background: var(--cream);
          border: var(--border-light);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-top: var(--spacing-xl);
          width: 100%;
          box-sizing: border-box;
        }

        .suggestions-header h3 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: var(--charcoal);
          margin-bottom: var(--spacing-md);
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-sm);
        }

        .suggestion-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          flex: 1;
          min-width: 0;
        }

        .suggestion-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-round);
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid var(--mist);
        }

        .suggestion-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .suggestion-name {
          font-weight: 600;
          color: var(--charcoal);
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .suggestion-username {
          color: var(--warm-taupe);
          font-size: 0.75rem;
          font-family: var(--font-mono);
        }

        .view-btn {
          color: var(--terracotta);
          font-weight: 600;
          font-size: 0.8rem;
          text-decoration: none;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: background 0.2s;
        }

        .view-btn:hover {
          background: var(--mist);
        }

        .suggestions-loading {
          padding: var(--spacing-lg);
          display: flex;
          justify-content: center;
        }

        .trending-section {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: var(--border-light);
        }

        .trending-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .trending-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-decoration: none;
          padding: 4px 0;
          transition: transform 0.2s;
        }

        .trending-item:hover {
          transform: translateX(4px);
        }

        .trending-tag {
          font-weight: 600;
          color: var(--charcoal);
          font-size: 0.95rem;
        }

        .trending-count {
          color: var(--warm-taupe);
          font-size: 0.75rem;
        }

        .show-more-link {
          color: var(--warm-taupe);
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .show-more-link:hover {
          color: var(--charcoal);
        }
      `}</style>
    </div>
  );
}
