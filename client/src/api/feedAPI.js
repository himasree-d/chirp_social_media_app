import api from './axiosInstance';

export const getFeed = (page = 1, limit = 10) => {
  return api.get(`/feed?page=${page}&limit=${limit}`);
};
