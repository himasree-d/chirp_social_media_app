import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as userAPI from '../api/userAPI';
import { Spinner } from '../components/UI';
import toast from 'react-hot-toast';
import { UserCheck, UserX, Clock } from 'lucide-react';

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await userAPI.getFollowRequests();
      setRequests(res.data.data);
    } catch (err) {
      console.error('Failed to fetch follow requests', err);
      toast.error('Could not load follow requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await userAPI.acceptFollowRequest(userId);
      toast.success('Follow request accepted');
      setRequests(requests.filter(r => r._id !== userId));
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (userId) => {
    try {
      await userAPI.rejectFollowRequest(userId);
      toast.success('Follow request rejected');
      setRequests(requests.filter(r => r._id !== userId));
    } catch (err) {
      toast.error('Failed to reject request');
    }
  };

  if (isLoading) return (
    <div className="requests-loading">
      <Spinner size={40} />
      <p>Loading requests...</p>
    </div>
  );

  return (
    <div className="requests-page slide-up">
      <div className="requests-header">
        <Clock size={32} className="header-icon" />
        <h1>Follow Requests</h1>
        <p>People who want to see your moments</p>
      </div>

      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="empty-requests">
            <p>No pending follow requests.</p>
            <Link to="/" className="back-link">Go back home</Link>
          </div>
        ) : (
          requests.map(user => (
            <div key={user._id} className="request-card">
              <Link to={`/${user.username}`} className="user-info">
                <img src={user.avatarUrl} alt="" className="user-avatar" />
                <div className="user-text">
                  <span className="display-name">{user.displayName}</span>
                  <span className="username">@{user.username}</span>
                </div>
              </Link>
              <div className="request-actions">
                <button 
                  className="action-btn accept" 
                  onClick={() => handleAccept(user._id)}
                  title="Accept"
                >
                  <UserCheck size={20} />
                  <span>Accept</span>
                </button>
                <button 
                  className="action-btn reject" 
                  onClick={() => handleReject(user._id)}
                  title="Reject"
                >
                  <UserX size={20} />
                  <span>Ignore</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx="true">{`
        .requests-page {
          max-width: 600px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-md);
        }

        .requests-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .header-icon {
          color: var(--terracotta);
          margin-bottom: var(--spacing-sm);
        }

        .requests-header h1 {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: var(--charcoal);
          margin-bottom: 4px;
        }

        .requests-header p {
          color: var(--warm-taupe);
          font-size: 1rem;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .request-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md);
          background: var(--cream);
          border: var(--border-light);
          border-radius: var(--radius-lg);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .request-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          text-decoration: none;
          flex: 1;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-round);
          object-fit: cover;
          border: 2px solid var(--sand);
        }

        .user-text {
          display: flex;
          flex-direction: column;
        }

        .display-name {
          font-weight: 700;
          color: var(--charcoal);
          font-size: 1rem;
        }

        .username {
          font-family: var(--font-mono);
          color: var(--warm-taupe);
          font-size: 0.8rem;
        }

        .request-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .action-btn.accept {
          background: var(--terracotta);
          color: var(--cream);
        }

        .action-btn.accept:hover {
          filter: brightness(1.1);
        }

        .action-btn.reject {
          background: var(--sand);
          color: var(--charcoal);
          border: var(--border-light);
        }

        .action-btn.reject:hover {
          background: var(--mist);
        }

        .empty-requests {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--warm-taupe);
          font-style: italic;
        }

        .back-link {
          display: inline-block;
          margin-top: var(--spacing-md);
          color: var(--terracotta);
          text-decoration: underline;
          font-style: normal;
        }

        .requests-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px;
          gap: 20px;
          color: var(--warm-taupe);
        }
      `}</style>
    </div>
  );
}
