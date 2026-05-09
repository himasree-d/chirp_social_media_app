import api from './axiosInstance';

export const getUserProfile = (username) => {
  return api.get(`/users/${username}`);
};

export const getUserPosts = (username, page = 1, limit = 10) => {
  return api.get(`/users/${username}/posts?page=${page}&limit=${limit}`);
};

export const followUser = (id) => {
  return api.post(`/users/${id}/follow`);
};

export const unfollowUser = (id) => {
  return api.delete(`/users/${id}/follow`);
};

export const removeFollower = (id) => {
  return api.delete(`/users/${id}/remove-follower`);
};

export const getFollowers = (userId) => {
  return api.get(`/users/${userId}/followers`);
};

export const getFollowing = (userId) => {
  return api.get(`/users/${userId}/following`);
};

export const getSuggestions = () => {
  return api.get('/users/suggestions');
};

export const getFollowRequests = () => {
  return api.get('/users/follow-requests');
};

export const acceptFollowRequest = (id) => {
  return api.put(`/users/${id}/accept-follow`);
};

export const rejectFollowRequest = (id) => {
  return api.delete(`/users/${id}/reject-follow`);
};

export const updateProfile = (userData) => {
  // Use FormData for potential avatar upload
  const formData = new FormData();
  if (userData.displayName) formData.append('displayName', userData.displayName);
  if (userData.bio !== undefined) formData.append('bio', userData.bio);
  if (userData.isPrivate !== undefined) formData.append('isPrivate', userData.isPrivate);
  if (userData.avatar) formData.append('avatar', userData.avatar);
  if (userData.banner) formData.append('banner', userData.banner);

  return api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
