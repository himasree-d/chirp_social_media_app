const Follow = require('../models/Follow');
const User = require('../models/User');
const Notification = require('../models/Notification');
const socketIO = require('../config/socket');

// @desc      Follow a user
// @route     POST /api/users/:id/follow
// @access    Private
exports.followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, error: 'You cannot follow yourself' });
    }

    // Check if already following or requested
    const existingFollow = await Follow.findOne({
      followerId: req.user.id,
      followingId: req.params.id
    });

    if (existingFollow) {
      if (existingFollow.status === 'pending') {
        return res.status(400).json({ success: false, error: 'Follow request already sent' });
      }
      return res.status(400).json({ success: false, error: 'You are already following this user' });
    }

    const status = userToFollow.isPrivate ? 'pending' : 'accepted';

    await Follow.create({
      followerId: req.user.id,
      followingId: req.params.id,
      status
    });

    // Create Notification and Emit Socket (Wrapped in try-catch to be non-blocking)
    try {
      const notificationType = status === 'pending' ? 'follow_request' : 'follow';
      const notification = await Notification.create({
        recipientId: req.params.id,
        senderId: req.user.id,
        type: notificationType
      });

      // Emit Socket Event
      let io;
      try {
        io = socketIO.getIo();
      } catch (e) {
        // Socket not initialized, skip emit
      }
      
      if (io) {
        io.to(req.params.id).emit('notification', {
          type: notificationType,
          sender: req.user,
          message: status === 'pending' 
            ? `${req.user.displayName} sent you a follow request.`
            : `${req.user.displayName} started following you.`,
          createdAt: notification.createdAt
        });
      }
    } catch (notifErr) {
      console.error('Notification/Socket error:', notifErr);
    }

    res.status(200).json({
      success: true,
      data: { status }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Unfollow a user or cancel request
// @route     DELETE /api/users/:id/follow
// @access    Private
exports.unfollowUser = async (req, res, next) => {
  try {
    const follow = await Follow.findOne({
      followerId: req.user.id,
      followingId: req.params.id
    });

    if (!follow) {
      return res.status(400).json({ success: false, error: 'Not following or requested' });
    }

    await follow.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get follow requests for current user
// @route     GET /api/users/follow-requests
// @access    Private
exports.getFollowRequests = async (req, res, next) => {
  try {
    const requests = await Follow.find({
      followingId: req.user.id,
      status: 'pending'
    }).populate('followerId', 'username displayName avatarUrl bio');

    res.status(200).json({
      success: true,
      data: requests.map(r => r.followerId)
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Accept follow request
// @route     PUT /api/users/:id/accept-follow
// @access    Private
exports.acceptFollowRequest = async (req, res, next) => {
  try {
    const follow = await Follow.findOne({
      followerId: req.params.id,
      followingId: req.user.id,
      status: 'pending'
    });

    if (!follow) {
      return res.status(404).json({ success: false, error: 'Follow request not found' });
    }

    follow.status = 'accepted';
    await follow.save();

    // Create Notification for the person who requested
    try {
      const notification = await Notification.create({
        recipientId: req.params.id,
        senderId: req.user.id,
        type: 'follow_accept'
      });

      let io;
      try {
        io = socketIO.getIo();
      } catch (e) {}
      
      if (io) {
        io.to(req.params.id).emit('notification', {
          type: 'follow_accept',
          sender: req.user,
          message: `${req.user.displayName} accepted your follow request.`,
          createdAt: notification.createdAt
        });
      }
    } catch (notifErr) {}

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Reject follow request
// @route     DELETE /api/users/:id/reject-follow
// @access    Private
exports.rejectFollowRequest = async (req, res, next) => {
  try {
    const follow = await Follow.findOneAndDelete({
      followerId: req.params.id,
      followingId: req.user.id,
      status: 'pending'
    });

    if (!follow) {
      return res.status(404).json({ success: false, error: 'Follow request not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get followers of a user
// @route     GET /api/users/:id/followers
// @access    Private
exports.getFollowers = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Privacy Check
    let canView = !targetUser.isPrivate || targetUserId === req.user.id;

    if (!canView) {
      // Check for accepted follow
      const amIFollowing = await Follow.findOne({ 
        followerId: req.user.id, 
        followingId: targetUserId,
        status: 'accepted'
      });
      if (amIFollowing) {
        canView = true;
      }
    }

    if (!canView) {
      return res.status(403).json({ success: false, error: 'This account is private' });
    }

    const followers = await Follow.find({ followingId: targetUserId, status: 'accepted' })
      .populate('followerId', 'username displayName avatarUrl bio');

    res.status(200).json({
      success: true,
      data: followers.map(f => f.followerId)
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get following of a user
// @route     GET /api/users/:id/following
// @access    Private
exports.getFollowing = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Privacy Check
    let canView = !targetUser.isPrivate || targetUserId === req.user.id;

    if (!canView) {
      // Check for accepted follow
      const amIFollowing = await Follow.findOne({ 
        followerId: req.user.id, 
        followingId: targetUserId,
        status: 'accepted'
      });
      if (amIFollowing) {
        canView = true;
      }
    }

    if (!canView) {
      return res.status(403).json({ success: false, error: 'This account is private' });
    }

    const following = await Follow.find({ followerId: targetUserId, status: 'accepted' })
      .populate('followingId', 'username displayName avatarUrl bio');

    res.status(200).json({
      success: true,
      data: following.map(f => f.followingId)
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get suggestions for users to follow
// @route     GET /api/users/suggestions
// @access    Private
exports.getSuggestions = async (req, res, next) => {
  try {
    // Users you are not following AND have not requested to follow
    const followRecords = await Follow.find({ followerId: req.user.id }).select('followingId');
    const excludedIds = [req.user.id, ...followRecords.map(f => f.followingId)];

    const suggestions = await User.find({ _id: { $nin: excludedIds } })
      .select('username displayName avatarUrl bio')
      .limit(5);

    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// @desc      Remove a follower (force-unfollow)
// @route     DELETE /api/users/:id/remove-follower
// @access    Private
exports.removeFollower = async (req, res, next) => {
  try {
    // req.params.id is the ID of the user you want to remove from YOUR followers
    const follow = await Follow.findOneAndDelete({
      followerId: req.params.id,
      followingId: req.user.id,
      status: 'accepted'
    });

    if (!follow) {
      return res.status(404).json({ success: false, error: 'This user is not following you' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
