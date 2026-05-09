import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import ExplorePost from '../components/Feed/ExplorePost';
import api from '../api/axiosInstance';
import { Spinner } from '../components/UI';

const MOODS = ['All', 'Calm', 'Inspired', 'Reflective', 'Joyful', 'Cozy', 'Dreamy', 'Creative'];

export default function Explore() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialMood = queryParams.get('mood') || 'All';

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const fetchPublicPosts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data.data);
      setFilteredPosts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch public posts', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicPosts();
  }, []);

  // Listen for custom events to refresh seamlessly
  useEffect(() => {
    const handleRefresh = () => {
      fetchPublicPosts();
    };
    window.addEventListener('postCreated', handleRefresh);
    window.addEventListener('postDeleted', handleRefresh);
    return () => {
      window.removeEventListener('postCreated', handleRefresh);
      window.removeEventListener('postDeleted', handleRefresh);
    };
  }, []);

  // Update selected mood if URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const moodFromUrl = params.get('mood');
    if (moodFromUrl && MOODS.includes(moodFromUrl)) {
      setSelectedMood(moodFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const res = await api.get(`/users/search?q=${searchTerm}`);
          setSearchResults(res.data.data);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedMood === 'All') {
      setFilteredPosts(posts);
    } else {
      const moodText = selectedMood;
      
      setFilteredPosts(posts.filter(post => {
        if (!post.tags || !Array.isArray(post.tags)) return false;
        return post.tags.some(tag => 
          tag.toLowerCase().includes(moodText.toLowerCase())
        );
      }));
    }
  }, [selectedMood, posts]);

  return (
    <div className="explore-page slide-up">
      <div className="explore-header">
        <h1 className="explore-title">Explore Chirp</h1>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for people..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="search-results-dropdown">
              {isSearching ? (
                <div className="search-status">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <a href={`/${user.username}`} key={user._id} className="search-result-item">
                    <img src={user.avatarUrl} alt="" className="result-avatar" />
                    <div className="result-info">
                      <span className="result-name">{user.displayName}</span>
                      <span className="result-username">@{user.username}</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="search-status">No people found.</div>
              )}
            </div>
          )}
        </div>
        
        <div className="mood-filter-bar">
          {MOODS.map(mood => (
            <button
              key={mood}
              className={`mood-filter-btn ${selectedMood === mood ? 'active' : ''}`}
              onClick={() => setSelectedMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="explore-loading">
          <Spinner />
          <p>Gathering inspiration...</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {filteredPosts.map(post => (
            <div key={post._id} className="masonry-item">
              <ExplorePost 
                post={post} 
                onUpdate={fetchPublicPosts} 
              />
            </div>
          ))}
        </Masonry>
      )}

      {filteredPosts.length === 0 && !isLoading && (
        <div className="explore-empty">
          <p>No moments found for this mood yet.</p>
        </div>
      )}

      <style jsx="true">{`
        .explore-page {
          padding-bottom: var(--spacing-2xl);
          width: 100%;
        }
        .explore-header {
          margin-bottom: var(--spacing-xl);
          text-align: center;
        }
        .explore-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--charcoal);
          margin-bottom: var(--spacing-md);
        }

        .search-container {
          position: relative;
          max-width: 400px;
          margin: 0 auto var(--spacing-lg);
          z-index: 100;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px;
          border-radius: var(--radius-organic);
          border: var(--border-medium);
          background: var(--cream);
          font-family: var(--font-body);
          font-size: 1rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--terracotta);
          box-shadow: var(--shadow-sm);
        }

        .search-results-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--cream);
          border: var(--border-light);
          border-radius: var(--radius-lg);
          margin-top: 8px;
          box-shadow: var(--shadow-lg);
          max-height: 300px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-bottom: var(--border-light);
          transition: background 0.2s;
          text-decoration: none;
        }

        .search-result-item:hover {
          background: var(--mist);
        }

        .result-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-round);
          object-fit: cover;
        }

        .result-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .result-name {
          font-weight: 600;
          color: var(--charcoal);
          font-size: 0.9rem;
        }

        .result-username {
          color: var(--warm-taupe);
          font-size: 0.8rem;
        }

        .search-status {
          padding: var(--spacing-md);
          text-align: center;
          color: var(--warm-taupe);
          font-style: italic;
        }
        .mood-filter-bar {
          display: flex;
          gap: var(--spacing-sm);
          overflow-x: auto;
          padding: var(--spacing-md) var(--spacing-md);
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .mood-filter-bar::-webkit-scrollbar {
          display: none;
        }
        .mood-filter-btn {
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-organic);
          border: var(--border-light);
          background: var(--cream);
          color: var(--warm-taupe);
          white-space: nowrap;
          font-weight: 500;
          transition: all 0.2s;
        }
        .mood-filter-btn.active {
          background: var(--terracotta);
          color: var(--cream);
          border-color: var(--terracotta);
        }
        .explore-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-2xl);
          color: var(--warm-taupe);
        }
        .explore-empty {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--warm-taupe);
          font-style: italic;
        }

        /* Masonry Grid */
        .my-masonry-grid {
          display: flex;
          margin-left: -4px; /* Even smaller gutter for "less space" */
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 4px; /* Even smaller gutter */
          background-clip: padding-box;
        }

        .masonry-item {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}
