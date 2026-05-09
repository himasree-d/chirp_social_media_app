import api from './axiosInstance';

export const createPost = (formData) => {
  return api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deletePost = (id) => {
  return api.delete(`/posts/${id}`);
};

export const likePost = (id) => {
  return api.post(`/posts/${id}/like`);
};

export const unlikePost = (id) => {
  return api.post(`/posts/${id}/unlike`);
};

export const addComment = (id, text) => {
  return api.post(`/posts/${id}/comments`, { text });
};

export const getComments = (id) => {
  return api.get(`/posts/${id}/comments`);
};

export const trackLinger = (id) => {
  return api.post(`/posts/${id}/linger`);
};

export const savePost = (id) => {
  return api.post(`/posts/${id}/save`);
};

export const unsavePost = (id) => {
  return api.delete(`/posts/${id}/save`);
};

export const getSavedPosts = () => {
  return api.get('/posts/saved');
};

export const updatePost = (id, data) => {
  return api.put(`/posts/${id}`, data);
};
