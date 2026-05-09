import { createPortal } from 'react-dom';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Logout?</h3>
        <p>Are you sure you want to log out of Haven?</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>Yes, logout</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>

      <style jsx="true">{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: var(--cream);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: var(--shadow-lg);
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin-bottom: var(--spacing-sm);
          color: var(--charcoal);
        }

        p {
          color: var(--warm-taupe);
          margin-bottom: var(--spacing-xl);
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        button {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-weight: 600;
          transition: transform 0.2s;
        }

        .confirm-btn {
          background: var(--terracotta);
          color: var(--cream);
        }

        .cancel-btn {
          background: transparent;
          color: var(--charcoal);
          border: 1px solid var(--border-medium);
        }

        button:active {
          transform: scale(0.98);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}
