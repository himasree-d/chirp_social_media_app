import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import FeedPost from './FeedPost';

export default function PostModal({ post, currentUserId, onClose }) {
  const modalContent = (
    <div className="post-modal-overlay" onClick={onClose}>
      <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-scroll-area">
          <FeedPost post={post} currentUserId={currentUserId} />
        </div>
      </div>

      <style jsx="true">{`
        .post-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(250, 248, 245, 0.6);
          backdrop-filter: blur(20px) saturate(180%);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.4s ease-out;
        }

        .post-modal-content {
          background: white;
          width: 100%;
          max-width: 480px;
          max-height: 90vh; 
          border-radius: var(--radius-lg);
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          overflow: hidden;
          animation: modalSpring 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 10000;
        }

        .modal-scroll-area {
          overflow-y: auto;
          flex-grow: 1;
          scrollbar-width: none;
        }

        .modal-scroll-area::-webkit-scrollbar {
          display: none;
        }

        .modal-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: white;
          border: 1px solid var(--sand);
          color: var(--charcoal);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 2001;
          box-shadow: var(--shadow-sm);
        }

        .modal-close-btn:hover {
          transform: rotate(90deg) scale(1.1);
          background: var(--mist);
        }

        @media (max-width: 600px) {
          .post-modal-overlay {
            padding: 0;
          }
          .post-modal-content {
            max-height: 100vh;
            border-radius: 0;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSpring {
          from { transform: scale(0.9) translateY(40px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
