const express = require('express');
const { getNotifications, markAllAsRead, markAsRead } = require('../controllers/notifications');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, getNotifications);

router
  .route('/read-all')
  .patch(protect, markAllAsRead);

router
  .route('/:id/read')
  .patch(protect, markAsRead);

module.exports = router;
