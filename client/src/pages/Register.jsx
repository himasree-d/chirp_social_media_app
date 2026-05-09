import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, displayName, email, password);
      toast.success('Your Chirp account has been created.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="auth-container slide-up">
      <div className="auth-card">
        <h1 className="auth-title">Chirp.</h1>
        <p className="auth-subtitle">Create your quiet space.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="displayName">Display Name</label>
            <input 
              id="displayName"
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="e.g. Alice Wonderland"
            />
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. alice"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. alice@example.com"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Choose a password"
            />
          </div>

          <button type="submit" className="auth-submit">Join Chirp</button>
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      <style jsx="true">{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 100px);
        }

        .auth-card {
          background: var(--cream);
          padding: var(--spacing-2xl) var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: var(--border-light);
          width: 100%;
          max-width: 400px;
          text-align: center;
          position: relative;
        }

        .auth-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: var(--texture-noise);
          opacity: 0.3;
          pointer-events: none;
        }

        .auth-title {
          font-family: var(--font-display);
          color: var(--terracotta);
          font-size: 2.5rem;
          margin-bottom: var(--spacing-xs);
        }

        .auth-subtitle {
          color: var(--warm-taupe);
          margin-bottom: var(--spacing-xl);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          text-align: left;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .input-group label {
          font-weight: 500;
          color: var(--charcoal);
          font-size: 0.9rem;
        }

        .input-group input {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: var(--border-medium);
          background: var(--sand);
          font-family: var(--font-body);
          color: var(--charcoal);
          outline: none;
          transition: border-color 0.2s;
        }

        .input-group input:focus {
          border-color: var(--terracotta);
        }

        .auth-submit {
          background-color: var(--terracotta);
          color: var(--cream);
          padding: var(--spacing-md);
          border-radius: var(--radius-organic);
          font-weight: 600;
          font-size: 1.05rem;
          margin-top: var(--spacing-sm);
          transition: opacity 0.2s;
        }

        .auth-submit:hover {
          opacity: 0.9;
        }

        .auth-redirect {
          margin-top: var(--spacing-xl);
          font-size: 0.9rem;
          color: var(--charcoal);
        }

        .auth-redirect a {
          color: var(--terracotta);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
