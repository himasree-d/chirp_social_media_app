import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as userAPI from '../api/userAPI';
import toast from 'react-hot-toast';
import { User, Shield, Moon, Bell } from 'lucide-react';

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await userAPI.updateProfile({
        displayName,
        bio,
        isPrivate,
        avatar
      });
      setUser(res.data.data);
      toast.success('Settings updated.');
    } catch (err) {
      toast.error('Failed to update settings.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="settings-page slide-up">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Customize your haven experience.</p>
      </header>

      <form onSubmit={handleSubmit} className="settings-form">
        <section className="settings-section">
          <div className="section-title">
            <User size={20} />
            <h2>Profile</h2>
          </div>
          
          <div className="avatar-upload">
            <div className="avatar-preview">
              <img src={avatarPreview} alt="Avatar Preview" />
            </div>
            <label htmlFor="avatar-input" className="avatar-label">
              Change Avatar
              <input 
                id="avatar-input" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange}
                hidden
              />
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="displayName">Display Name</label>
            <input 
              id="displayName"
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="bio">Bio</label>
            <textarea 
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A little bit about you..."
              rows={3}
            />
          </div>
        </section>

        <section className="settings-section">
          <div className="section-title">
            <Shield size={20} />
            <h2>Privacy</h2>
          </div>
          
          <div className="toggle-group">
            <div className="toggle-text">
              <h3>Private Profile</h3>
              <p>Only people you approve can see your ripples and profile.</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-title">
            <Moon size={20} />
            <h2>Quiet Hours</h2>
          </div>
          <p className="hint text-sm text-gray-500">Quiet hours are automatically active from 10 PM to 6 AM.</p>
        </section>

        <button 
          type="submit" 
          className="save-btn" 
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <style jsx="true">{`
        .settings-page {
          max-width: 600px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: var(--spacing-2xl);
        }

        .settings-header h1 {
          font-family: var(--font-display);
          font-size: 2.5rem;
          color: var(--charcoal);
        }

        .settings-header p {
          color: var(--warm-taupe);
          font-size: 1.1rem;
        }

        .settings-section {
          background: var(--cream);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          border: var(--border-light);
          margin-bottom: var(--spacing-xl);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          color: var(--terracotta);
        }

        .section-title h2 {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .avatar-upload {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .avatar-preview img {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-organic);
          object-fit: cover;
          border: 2px solid var(--sand);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
        }

        .input-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--warm-taupe);
          font-family: var(--font-mono);
        }

        .input-group input, 
        .input-group textarea {
          width: 100%;
          background: var(--sand);
          border: 1px solid transparent;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--charcoal);
          transition: border-color 0.2s, background 0.2s;
        }

        .input-group textarea {
          resize: vertical;
          min-height: 100px;
        }

        .input-group input:focus, 
        .input-group textarea:focus {
          outline: none;
          border-color: var(--terracotta);
          background: var(--cream);
        }

        .avatar-label {
          background: var(--sand);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .avatar-label:hover {
          background: #e5e0d8;
        }

        .toggle-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--sand);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
        }

        .toggle-text h3 {
          font-size: 1rem;
          font-weight: 600;
        }

        .toggle-text p {
          font-size: 0.85rem;
          color: var(--warm-taupe);
          margin-top: 2px;
        }

        .save-btn {
          width: 100%;
          background: var(--terracotta);
          color: var(--cream);
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
          font-weight: 600;
          font-size: 1.1rem;
          margin-top: var(--spacing-lg);
          transition: transform 0.2s, opacity 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Switch Slider Styles */
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: var(--terracotta);
        }

        input:focus + .slider {
          box-shadow: 0 0 1px var(--terracotta);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
