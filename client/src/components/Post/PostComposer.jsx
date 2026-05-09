import { useState, useRef } from 'react';
import { X, UploadCloud, XCircle } from 'lucide-react';
import * as postAPI from '../../api/postAPI';
import toast from 'react-hot-toast';

const MOODS = ['Calm', 'Inspired', 'Reflective', 'Joyful', 'Cozy', 'Dreamy', 'Creative'];

export default function PostComposer({ isOpen, onClose }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const fileInputRef = useRef(null);

  const charLimit = 280;
  const progressPercentage = (caption.length / charLimit) * 100;
  const isOverLimit = caption.length > charLimit;

  // Handle Drag & Drop
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelection(e.dataTransfer.files[0]);
    }
  };

  const handleImageSelection = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || isOverLimit) return;
    
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    formData.append('tags', JSON.stringify(selectedTags));
    formData.append('visibility', visibility);

    try {
      await postAPI.createPost(formData);
      toast.success('Shared to Haven.');
      
      // Reset
      setCaption('');
      setImage(null);
      setPreviewUrl('');
      setSelectedTags([]);
      setVisibility('public');
      onClose();
      
      // Trigger seamless refresh via custom event
      const newPostEvent = new CustomEvent('postCreated');
      window.dispatchEvent(newPostEvent);
    } catch (err) {
      toast.error('Failed to post.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="composer-backdrop" onClick={onClose} />
      
      <div className={`composer-panel ${isOpen ? 'open' : ''}`}>
        <div className="composer-header">
          <h3>Create Post</h3>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="composer-body">
          {/* Drag & Drop Zone */}
          {!previewUrl ? (
            <div 
              className="upload-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <UploadCloud size={48} color="var(--warm-taupe)" />
              <p>Drag & drop or click to upload</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => handleImageSelection(e.target.files[0])} 
                accept="image/*" 
                hidden 
              />
            </div>
          ) : (
            <div className="image-preview-container">
              <img src={previewUrl} alt="Preview" className="image-preview" />
              <button 
                type="button" 
                className="remove-img-btn"
                onClick={() => { setImage(null); setPreviewUrl(''); }}
              >
                <XCircle size={24} fill="var(--charcoal)" color="var(--cream)" />
              </button>
            </div>
          )}

          {/* Caption Input */}
          <div className="caption-container">
            <textarea
              placeholder="What's your mood?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="caption-input"
              rows={4}
            />
            
            <div className="char-counter">
              <svg className="progress-ring" width="24" height="24">
                <circle className="progress-ring-circle-bg" stroke="var(--sand)" strokeWidth="2" fill="transparent" r="10" cx="12" cy="12" />
                <circle 
                  className="progress-ring-circle" 
                  stroke={isOverLimit ? "red" : "var(--terracotta)"} 
                  strokeWidth="2" 
                  fill="transparent" 
                  r="10" 
                  cx="12" 
                  cy="12" 
                  strokeDasharray={`${progressPercentage * 0.628} 100`}
                />
              </svg>
              <span className={isOverLimit ? 'over-limit' : ''}>{caption.length} / {charLimit}</span>
            </div>
          </div>

          {/* Mood Tags */}
          <div className="composer-moods">
            <p className="section-label">Current Mood (Max 3)</p>
            <div className="mood-grid">
              {MOODS.map(mood => (
                <button
                  key={mood}
                  type="button"
                  className={`mood-tag ${selectedTags.includes(mood) ? 'selected' : ''}`}
                  onClick={() => toggleTag(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="composer-visibility">
            <p className="section-label">Who can see this?</p>
            <div className="visibility-options">
              <button
                type="button"
                className={`visibility-btn ${visibility === 'public' ? 'active' : ''}`}
                onClick={() => setVisibility('public')}
              >
                Public
              </button>
              <button
                type="button"
                className={`visibility-btn ${visibility === 'ripple' ? 'active' : ''}`}
                onClick={() => setVisibility('ripple')}
              >
                Ripple (48h)
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!image || isOverLimit}
          >
            Share to Haven
          </button>
        </form>
      </div>

      <style jsx="true">{`
        .composer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(58, 53, 48, 0.4);
          backdrop-filter: blur(2px);
          z-index: 999;
          animation: fadeIn 0.3s ease forwards;
        }

        .composer-panel {
          position: fixed;
          background: var(--cream);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Desktop: Right-side panel */
        @media (min-width: 769px) {
          .composer-panel {
            top: 0;
            right: 0;
            width: 400px;
            height: 100vh;
            border-left: var(--border-light);
            transform: translateX(100%);
          }
          .composer-panel.open {
            transform: translateX(0);
          }
        }

        /* Mobile: Bottom drawer */
        @media (max-width: 768px) {
          .composer-panel {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 85vh;
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            transform: translateY(100%);
          }
          .composer-panel.open {
            transform: translateY(0);
          }
        }

        .composer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: var(--border-light);
        }

        .composer-header h3 {
          color: var(--terracotta);
          margin: 0;
        }

        .composer-body {
          padding: var(--spacing-lg);
          overflow-y: auto;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .upload-zone {
          border: 2px dashed var(--warm-taupe);
          border-radius: var(--radius-lg);
          height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          background: var(--sand);
          cursor: pointer;
          transition: background 0.2s;
        }

        .upload-zone:hover {
          background: var(--mist);
        }

        .image-preview-container {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .image-preview {
          width: 100%;
          display: block;
          object-fit: cover;
        }

        .remove-img-btn {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .caption-container {
          position: relative;
          background: white;
          border: var(--border-light);
          border-radius: var(--radius-md);
          padding: var(--spacing-sm);
        }

        .caption-input {
          width: 100%;
          border: none;
          resize: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--charcoal);
          background: transparent;
        }

        .char-counter {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--warm-taupe);
        }

        .over-limit {
          color: red;
        }

        .progress-ring-circle {
          transition: stroke-dasharray 0.3s;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }

        .composer-moods {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .mood-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }

        .mood-tag {
          padding: 6px 14px;
          border-radius: var(--radius-organic);
          background: var(--sand);
          color: var(--warm-taupe);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        
        .mood-tag:hover {
          background: var(--mist);
        }

        .mood-tag.selected {
          background: var(--terracotta);
          color: var(--cream);
          border-color: var(--terracotta);
          box-shadow: var(--shadow-sm);
        }

        .composer-visibility {
          margin-top: var(--spacing-lg);
        }

        .visibility-options {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-xs);
        }

        .visibility-btn {
          flex: 1;
          padding: var(--spacing-sm);
          border-radius: var(--radius-md);
          border: var(--border-medium);
          background: var(--sand);
          color: var(--warm-taupe);
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .visibility-btn.active {
          background: var(--charcoal);
          color: var(--cream);
          border-color: var(--charcoal);
        }

        .submit-btn {
          margin-top: auto;
          background: var(--terracotta);
          color: var(--cream);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
