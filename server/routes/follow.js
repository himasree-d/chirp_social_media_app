const express = require('express');
const { followUser, unfollowUser } = require('../controllers/follow');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(protect, followUser)
  .delete(protect, unfollowUser);

module.exports = router;
