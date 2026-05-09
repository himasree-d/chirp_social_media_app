import api from './axiosInstance';

export const getNotifications = () => {
  return api.get('/notifications');
};

export const markAllAsRead = () => {
  return api.patch('/notifications/read-all');
};

export const markAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};
