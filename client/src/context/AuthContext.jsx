import { createContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    setUser(res.data.data);
  };

  const register = async (username, displayName, email, password) => {
    const res = await api.post('/auth/register', { username, displayName, email, password });
    setUser(res.data.data);
  };

  const logout = async () => {
    await api.get('/auth/logout');
    setUser(null);
  };

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      login, 
      register, 
      logout,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};
