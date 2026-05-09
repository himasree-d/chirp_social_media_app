export const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: '32px',
    md: '40px',
    lg: '64px',
    xl: '120px'
  };

  return (
    <div className={`avatar-container ${className}`} style={{ width: sizeMap[size], height: sizeMap[size] }}>
      <img src={src} alt={alt} className="avatar-img" />
      <style jsx="true">{`
        .avatar-container {
          border-radius: var(--radius-organic);
          overflow: hidden;
          background: var(--sand);
          border: var(--border-light);
          flex-shrink: 0;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export const Button = ({ children, variant = 'primary', onClick, className = '', type = 'button', disabled = false }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
      <style jsx="true">{`
        .btn {
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-organic);
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
          font-family: var(--font-body);
        }
        .btn-primary {
          background: var(--charcoal);
          color: var(--cream);
          border: none;
        }
        .btn-outline {
          background: transparent;
          border: var(--border-medium);
          color: var(--charcoal);
        }
        .btn-ghost {
          background: transparent;
          border: none;
          color: var(--warm-taupe);
        }
        .btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </button>
  );
};

export const Tag = ({ children, className = '' }) => {
  return (
    <span className={`tag-chip ${className}`}>
      {children}
      <style jsx="true">{`
        .tag-chip {
          padding: 4px 10px;
          background: var(--mist);
          color: var(--charcoal);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </span>
  );
};

export const Spinner = ({ color = 'var(--terracotta)' }) => {
  return (
    <div className="spinner">
      <style jsx="true">{`
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0,0,0,0.1);
          border-top-color: ${color};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
