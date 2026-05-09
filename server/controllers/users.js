const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');

// @desc      Get public profile
// @route     GET /api/users/:username
// @access    Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-passwordHash -coverMoodUrls');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const postCount = await Post.countDocuments({ authorId: user._id });
    const followerCount = await Follow.countDocuments({ followingId: user._id, status: 'accepted' });
    const followingCount = await Follow.countDocuments({ followerId: user._id, status: 'accepted' });

    let followStatus = null;
    if (req.user) {
      const follow = await Follow.findOne({
        followerId: req.user.id,
        followingId: user._id
      });
      followStatus = follow ? follow.status : null;
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        postCount,
        followerCount,
        followingCount,
        followStatus
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Get user posts
// @route     GET /api/users/:username/posts
// @access    Public
exports.getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const posts = await Post.find({ authorId: user._id })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('authorId', 'username displayName avatarUrl');

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update user profile
// @route     PUT /api/users/profile
// @access    Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.displayName) fieldsToUpdate.displayName = req.body.displayName;
    if (req.body.bio !== undefined) fieldsToUpdate.bio = req.body.bio;
    if (req.body.isPrivate !== undefined) fieldsToUpdate.isPrivate = req.body.isPrivate;

    // Handle file uploads
    if (req.files) {
      const processFile = (file) => {
        if (file.path.includes('cloudinary.com')) return file.path;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return `${baseUrl}/uploads/${file.filename}`;
      };

      if (req.files.avatar) {
        fieldsToUpdate.avatarUrl = processFile(req.files.avatar[0]);
      }
      if (req.files.banner) {
        fieldsToUpdate.coverImageUrl = processFile(req.files.banner[0]);
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// @desc      Search users
// @route     GET /api/users/search
// @access    Private
exports.searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(200).json({ success: true, data: [] });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ]
    }).select('username displayName avatarUrl bio').limit(20);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
