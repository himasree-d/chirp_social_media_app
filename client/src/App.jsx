import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { useSocket } from './hooks/useSocket';
import FeedSkeleton from './components/Feed/FeedSkeleton';

import AppLayout from './components/Layout/AppLayout';
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/Profile';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import FollowRequests from './pages/FollowRequests';
import Saved from './pages/Saved';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, darkMode } = useContext(AuthContext);
  useSocket(user?._id);
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="app-container">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'var(--sand)',
            color: 'var(--charcoal)',
            fontFamily: 'var(--font-body)',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border-light)'
          }
        }} 
      />
      <AppLayout>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/follow-requests" element={
            <ProtectedRoute>
              <FollowRequests />
            </ProtectedRoute>
          } />
          <Route path="/saved" element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/:username" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </AppLayout>
    </div>
  );
}

export default App;
