const express = require('express');
const followRouter = require('./follow');

const router = express.Router();
const { getUserProfile, getUserPosts, updateProfile, searchUsers } = require('../controllers/users');
const { 
  getFollowers, 
  getFollowing, 
  getSuggestions, 
  getFollowRequests, 
  acceptFollowRequest, 
  rejectFollowRequest,
  removeFollower
} = require('../controllers/follow');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Re-route into other resource routers
router.use('/:id/follow', followRouter);

router.put('/profile', protect, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateProfile);
router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestions);
router.get('/follow-requests', protect, getFollowRequests);
router.put('/:id/accept-follow', protect, acceptFollowRequest);
router.delete('/:id/reject-follow', protect, rejectFollowRequest);
router.delete('/:id/remove-follower', protect, removeFollower);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);
router.get('/:username', optionalProtect, getUserProfile);
router.get('/:username/posts', getUserPosts);

module.exports = router;
