import { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ExplorePost from '../components/Feed/ExplorePost';
import FollowListModal from '../components/Profile/FollowListModal';
import { AuthContext } from '../context/AuthContext';
import * as userAPI from '../api/userAPI';
import * as postAPI from '../api/postAPI';
import toast from 'react-hot-toast';
import { Grid, Bookmark, MapPin, MoreVertical, Heart, Camera } from 'lucide-react';
import { Spinner } from '../components/UI';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, setUser: setCurrentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTabs, setIsLoadingTabs] = useState(false);
  const [followStatus, setFollowStatus] = useState(null); 
  const [activeTab, setActiveTab] = useState('posts');
  const [isUpdatingBanner, setIsUpdatingBanner] = useState(false);
  
  const bannerInputRef = useRef(null);

  // Derived early so it's available in all hooks
  const isOwnProfile = !!currentUser && currentUser.username === username;

  // Modal states
  const [modalType, setModalType] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const userRes = await userAPI.getUserProfile(username);
      setUser(userRes.data.data);
      setFollowStatus(userRes.data.data.followStatus);

      const postsRes = await userAPI.getUserPosts(username);
      setPosts(postsRes.data.data);
    } catch (err) {
      toast.error('User not found');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    setIsLoadingTabs(true);
    try {
      const res = await postAPI.getSavedPosts();
      setSavedPosts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch saved posts', err);
    } finally {
      setIsLoadingTabs(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (activeTab === 'saved' && isOwnProfile) {
      fetchSavedPosts();
    }
  }, [activeTab]);

  // Listen for custom events for seamless updates
  useEffect(() => {
    const handleRefresh = () => {
      fetchProfile();
      if (activeTab === 'saved' && isOwnProfile) {
        fetchSavedPosts();
      }
    };

    window.addEventListener('postCreated', handleRefresh);
    window.addEventListener('postDeleted', handleRefresh);
    
    return () => {
      window.removeEventListener('postCreated', handleRefresh);
      window.removeEventListener('postDeleted', handleRefresh);
    };
  }, [username, activeTab, isOwnProfile]);

  const handleFollowAction = async () => {
    if (!currentUser) return toast.error('Please login to continue');
    
    if (followStatus === 'accepted') {
      const confirmUnfollow = window.confirm(`Are you sure you want to unfollow ${user.displayName}?`);
      if (!confirmUnfollow) return;
      
      try {
        await userAPI.unfollowUser(user._id);
        setFollowStatus(null);
        toast.success(`Unfollowed ${user.displayName}`);
        fetchProfile();
      } catch (err) {
        toast.error('Failed to unfollow');
      }
      return;
    }

    if (followStatus === 'pending') {
      try {
        await userAPI.unfollowUser(user._id);
        setFollowStatus(null);
        toast.success('Follow request cancelled');
        fetchProfile();
      } catch (err) {
        toast.error('Failed to cancel request');
      }
      return;
    }

    try {
      const res = await userAPI.followUser(user._id);
      const newStatus = res.data.data.status;
      setFollowStatus(newStatus);
      
      if (newStatus === 'pending') {
        toast.success('Follow request sent');
      } else {
        toast.success(`Following ${user.displayName}`);
      }
      fetchProfile();
    } catch (err) {
      toast.error('Failed to follow');
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdatingBanner(true);
    const formData = {
      banner: file
    };

    try {
      const res = await userAPI.updateProfile(formData);
      setUser(prev => ({ ...prev, coverImageUrl: res.data.data.coverImageUrl }));
      if (isOwnProfile) {
        setCurrentUser(res.data.data);
      }
      toast.success('Banner updated successfully');
    } catch (err) {
      toast.error('Failed to update banner');
      console.error(err);
    } finally {
      setIsUpdatingBanner(false);
    }
  };

  const openFollowers = () => {
    setModalType('followers');
    setIsModalOpen(true);
  };

  const openFollowing = () => {
    setModalType('following');
    setIsModalOpen(true);
  };

  if (isLoading) return (
    <div className="profile-loading">
      <Spinner size={48} />
      <p>Opening your garden...</p>
    </div>
  );
  
  if (!user) return <div className="profile-error">User not found.</div>;

  const isFollowing = followStatus === 'accepted';
  const isRequested = followStatus === 'pending';

  const displayedPosts = activeTab === 'posts' ? posts : savedPosts;

  return (
    <div className="profile-container slide-up">
      {/* Banner Section */}
      <div className="profile-banner">
        <img 
          src={user.coverImageUrl || posts[0]?.imageUrl || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1500"} 
          alt="Banner" 
          className="banner-img" 
        />
        <div className="banner-overlay"></div>
        
        {isOwnProfile && (
          <>
            <button 
              className="change-banner-btn" 
              onClick={() => bannerInputRef.current.click()}
              disabled={isUpdatingBanner}
            >
              {isUpdatingBanner ? <Spinner size={16} /> : <Camera size={20} />}
              <span>Change Banner</span>
            </button>
            <input 
              type="file" 
              ref={bannerInputRef} 
              hidden 
              accept="image/*" 
              onChange={handleBannerUpload} 
            />
          </>
        )}
      </div>

      {/* Header Content (Centered) */}
      <div className="profile-header">
        <div className="avatar-outer">
          <div className="avatar-inner">
            <img src={user.avatarUrl} alt={user.displayName} className="main-avatar" />
          </div>
        </div>

        <div className="user-info-centered">
          <h1 className="display-name">{user.displayName}</h1>
          <p className="handle">@{user.username}</p>
          
          <p className="bio-text">{user.bio || "Finding beauty in the everyday."}</p>
          
          <div className="meta-info">
            {user.location && (
              <div className="info-item">
                <MapPin size={14} />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="count">{user.postCount || 0}</span>
            <span className="label">Posts</span>
          </div>
          <button className="stat-item clickable" onClick={openFollowers}>
            <span className="count">{user.followerCount || 0}</span>
            <span className="label">Followers</span>
          </button>
          <button className="stat-item clickable" onClick={openFollowing}>
            <span className="count">{user.followingCount || 0}</span>
            <span className="label">Following</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions-centered">
          {isOwnProfile ? (
            <div className="own-actions">
              <Link to="/settings" className="edit-profile-btn">Edit Profile</Link>
            </div>
          ) : (
            <button 
              className={`follow-btn-main ${isFollowing ? 'following' : ''} ${isRequested ? 'requested' : ''}`}
              onClick={handleFollowAction}
            >
              {isFollowing ? 'Following' : isRequested ? 'Requested' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <Grid size={20} />
          <span>Posts</span>
        </button>
        {isOwnProfile && (
          <button 
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Bookmark size={20} />
            <span>Saved</span>
          </button>
        )}
        <button 
          className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          <Heart size={20} />
          <span>Likes</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="profile-content-grid">
        {user.isPrivate && !isOwnProfile && !isFollowing ? (
          <div className="private-notice">
            <p>This account is private. Follow them to see their moments.</p>
          </div>
        ) : isLoadingTabs ? (
          <div className="tab-loading"><Spinner /></div>
        ) : displayedPosts.length === 0 ? (
          <div className="empty-notice">
            <p>No moments to show here yet.</p>
          </div>
        ) : (
          <div className="square-grid">
            {displayedPosts.map(post => (
              <ExplorePost 
                key={post._id} 
                post={post} 
                onUpdate={fetchProfile} 
              />
            ))}
          </div>
        )}
      </div>

      <FollowListModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        userId={user._id}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        isOwnFollowers={isOwnProfile && modalType === 'followers'}
      />

      <style jsx="true">{`
        .profile-container {
          width: 100%;
          max-width: 935px;
          margin: 0 auto;
          background: transparent;
          min-height: 100vh;
          padding-bottom: 50px;
        }

        /* Banner */
        .profile-banner {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: var(--cream-light);
          padding: 10px;
        }

        .banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.6;
          transition: opacity 0.3s ease;
          border-radius: 20px;
        }

        .profile-banner:hover .banner-img {
          opacity: 1;
        }

        .banner-overlay {
          position: absolute;
          inset: 10px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1), transparent 40%);
          pointer-events: none;
          border-radius: 20px;
        }

        .change-banner-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          border: none;
          color: var(--charcoal);
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          z-index: 20;
          opacity: 0;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }

        .profile-banner:hover .change-banner-btn {
          opacity: 1;
        }

        .change-banner-btn:hover {
          background: var(--cream);
          transform: translateY(-2px);
        }

        /* Header */
        .profile-header {
          position: relative;
          padding-top: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-bottom: 20px;
        }

        .avatar-outer {
          position: absolute;
          top: -85px;
          left: 50%;
          transform: translateX(-50%);
          padding: 5px;
          background: var(--cream);
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .avatar-inner {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid var(--border-light);
        }

        .main-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info-centered {
          margin-bottom: 20px;
          padding: 0 20px;
        }

        .display-name {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 2px;
        }

        .handle {
          font-family: var(--font-mono);
          color: var(--warm-taupe);
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .bio-text {
          font-size: 0.95rem;
          color: var(--charcoal);
          max-width: 450px;
          line-height: 1.5;
          margin: 0 auto 12px;
        }

        .meta-info {
          display: flex;
          justify-content: center;
          gap: 20px;
          color: var(--warm-taupe);
          font-size: 0.85rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Stats */
        .stats-row {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-bottom: 25px;
          width: 100%;
          padding: 15px 0;
          border-top: var(--border-light);
          border-bottom: var(--border-light);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: none;
          border: none;
          padding: 0;
        }

        .stat-item.clickable {
          cursor: pointer;
        }

        .stat-item .count {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--charcoal);
        }

        .stat-item .label {
          font-size: 0.8rem;
          color: var(--warm-taupe);
        }

        /* Actions */
        .profile-actions-centered {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0 20px 20px;
        }

        .own-actions {
          display: flex;
          gap: 10px;
          width: 100%;
          max-width: 320px;
        }

        .edit-profile-btn {
          flex: 1;
          background: var(--sand);
          color: var(--charcoal);
          border: none;
          padding: 9px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .follow-btn-main {
          width: 100%;
          max-width: 320px;
          background: var(--terracotta);
          color: var(--cream);
          border: none;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .follow-btn-main.following {
          background: var(--sand);
          color: var(--charcoal);
        }

        /* Tabs */
        .profile-tabs {
          display: flex;
          justify-content: center;
          gap: 60px;
          border-top: 1px solid var(--border-light);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 15px 0;
          background: none;
          border: none;
          color: var(--warm-taupe);
          cursor: pointer;
          border-top: 1px solid transparent;
          margin-top: -1px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .tab-btn.active {
          color: var(--charcoal);
          border-top-color: var(--charcoal);
        }

        /* Content Grid */
        .profile-content-grid {
          padding: 2px;
        }

        .square-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }

        .private-notice, .empty-notice, .tab-loading {
          padding: 80px 20px;
          text-align: center;
          color: var(--warm-taupe);
          grid-column: span 3;
        }

        .profile-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 80vh;
          gap: 20px;
          color: var(--warm-taupe);
        }

        @media (max-width: 735px) {
          .stats-row {
            gap: 30px;
          }
          .profile-tabs {
            gap: 30px;
          }
          .tab-btn span {
            display: none;
          }
          .avatar-inner {
            width: 120px;
            height: 120px;
          }
          .avatar-outer {
            top: -70px;
          }
          .change-banner-btn span {
            display: none;
          }
          .change-banner-btn {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
}
