import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      toast.success('Welcome back to Chirp.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="auth-container slide-up">
      <div className="auth-card">
        <h1 className="auth-title">Chirp.</h1>
        <p className="auth-subtitle">Welcome back to your quiet space.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit">Log In</button>
        </form>

        <p className="auth-redirect">
          New to Chirp? <Link to="/register">Create an account</Link>
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

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-wrapper input {
          width: 100%;
          padding-right: 45px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--warm-taupe);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: var(--charcoal);
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
          background-color: var(--charcoal);
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
