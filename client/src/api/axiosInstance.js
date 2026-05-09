import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api',
  withCredentials: true // Important for sending/receiving HTTP-only cookies
});

// Response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Potentially clear user state or redirect to login
      // We will handle this gracefully in AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;
