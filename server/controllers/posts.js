const Post = require('../models/Post');
const User = require('../models/User');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const socketIO = require('../config/socket');

// @desc      Get all posts (for testing/explore)
// @route     GET /api/posts
// @access    Public
exports.getPosts = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    
    // 1. Get the list of users the current user follows
    const following = await Follow.find({ 
      followerId: currentUserId, 
      status: 'accepted' 
    }).select('followingId');
    
    const followingIds = following.map(f => f.followingId);

    // 2. Fetch posts from followed users (excluding own)
    const followedPosts = await Post.find({
      authorId: { $in: followingIds, $ne: currentUserId }
    })
    .populate('authorId', 'username displayName avatarUrl isPrivate')
    .sort({ createdAt: -1 })
    .lean();

    // 3. Fetch recommended public posts (from users not followed and not self)
    const recommendedPosts = await Post.find({
      authorId: { $nin: [...followingIds, currentUserId] }
    })
    .populate({
      path: 'authorId',
      select: 'username displayName avatarUrl isPrivate',
      match: { isPrivate: false }
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    // Filter out posts where authorId became null due to match: { isPrivate: false }
    const validRecommended = recommendedPosts
      .filter(p => p.authorId !== null)
      .map(p => ({ ...p, isRecommended: true }));

    // 4. Combine: followed posts first
    const allPosts = [...followedPosts, ...validRecommended];

    res.status(200).json({
      success: true,
      count: allPosts.length,
      data: allPosts
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get single post
// @route     GET /api/posts/:id
// @access    Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'username displayName avatarUrl');

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Create new post
// @route     POST /api/posts
// @access    Private
exports.createPost = async (req, res, next) => {
  try {
    req.body.authorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload an image' });
    }

    if (req.file.path.includes('cloudinary.com')) {
      req.body.imageUrl = req.file.path;
      // Cloudinary thumbnail
      const urlParts = req.file.path.split('/upload/');
      req.body.thumbnailUrl = `${urlParts[0]}/upload/c_thumb,w_400/${urlParts[1]}`;
    } else {
      // Local fallback
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      req.body.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      req.body.thumbnailUrl = req.body.imageUrl;
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        req.body.tags = [req.body.tags];
      }
    }

    const post = await Post.create(req.body);

    // Notify followers of new post
    try {
      const followers = await Follow.find({ followingId: req.user.id, status: 'accepted' });
      
      let io;
      try {
        io = socketIO.getIo();
      } catch (e) {}

      const notificationPromises = followers.map(async (follow) => {
        const notification = await Notification.create({
          recipientId: follow.followerId,
          senderId: req.user.id,
          type: 'new_post',
          postId: post._id
        });

        // Emit real-time notification
        if (io) {
          io.to(follow.followerId.toString()).emit('notification', {
            type: 'new_post',
            sender: {
              _id: req.user.id,
              username: req.user.username,
              displayName: req.user.displayName,
              avatarUrl: req.user.avatarUrl
            },
            postId: post._id,
            postImage: post.imageUrl,
            message: `${req.user.displayName} shared a new moment.`,
            createdAt: notification.createdAt
          });
        }
      });

      await Promise.all(notificationPromises);
    } catch (notifErr) {
      console.error('Failed to notify followers:', notifErr);
    }

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Update post
// @route     PUT /api/posts/:id
// @access    Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Make sure user is post owner
    if (post.authorId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this post' });
    }

    const { caption, tags, visibility } = req.body;
    
    post = await Post.findByIdAndUpdate(req.params.id, { caption, tags, visibility }, {
      new: true,
      runValidators: true
    }).populate('authorId', 'username displayName avatarUrl');

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Delete post
// @route     DELETE /api/posts/:id
// @access    Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Make sure user is post owner
    if (post.authorId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Like a post
// @route     POST /api/posts/:id/like
// @access    Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(200).json({ success: true, data: post.likes });
    }

    post.likes.push(req.user.id);
    await post.save();

    // Create Notification if liking someone else's post
    if (post.authorId.toString() !== req.user.id) {
      try {
        const notification = await Notification.create({
          recipientId: post.authorId,
          senderId: req.user.id,
          type: 'like',
          postId: post._id
        });

        // Emit Socket Event
        const io = socketIO.getIo();
        if (io) {
          io.to(post.authorId.toString()).emit('notification', {
            type: 'like',
            sender: req.user,
            postId: post._id,
            message: `${req.user.displayName} liked your post.`,
            createdAt: notification.createdAt
          });
        }
      } catch (notifErr) {}
    }

    res.status(200).json({
      success: true,
      data: post.likes
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Unlike a post
// @route     DELETE /api/posts/:id/like
// @access    Private
exports.unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({ success: false, error: 'Post has not been liked' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      data: post.likes
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const Comment = require('../models/Comment');

// @desc      Add comment to a post
// @route     POST /api/posts/:id/comments
// @access    Private
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const comment = await Comment.create({
      postId: req.params.id,
      authorId: req.user.id,
      text: req.body.text
    });

    post.commentsCount += 1;
    await post.save();

    // Create Notification if commenting on someone else's post
    if (post.authorId.toString() !== req.user.id) {
      try {
        const notification = await Notification.create({
          recipientId: post.authorId,
          senderId: req.user.id,
          type: 'comment',
          postId: post._id
        });

        // Emit Socket Event
        const io = socketIO.getIo();
        if (io) {
          io.to(post.authorId.toString()).emit('notification', {
            type: 'comment',
            sender: req.user,
            postId: post._id,
            message: `${req.user.displayName} commented on your post.`,
            createdAt: notification.createdAt
          });
        }
      } catch (notifErr) {}
    }

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get comments for a post
// @route     GET /api/posts/:id/comments
// @access    Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('authorId', 'username displayName avatarUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Track lingering on a post
// @route     POST /api/posts/:id/linger
// @access    Private
exports.lingerPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Check if user already lingered
    if (post.lingerers.includes(req.user.id)) {
      return res.status(200).json({ success: true, data: post });
    }

    post.lingerers.push(req.user.id);
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Save a post
// @route     POST /api/posts/:id/save
// @access    Private
exports.savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { savedPosts: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user.savedPosts
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Unsave a post
// @route     DELETE /api/posts/:id/save
// @access    Private
exports.unsavePost = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedPosts: req.params.id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user.savedPosts
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get saved posts
// @route     GET /api/posts/saved
// @access    Private
exports.getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedPosts',
      populate: {
        path: 'authorId',
        select: 'username displayName avatarUrl'
      }
    });

    res.status(200).json({
      success: true,
      data: user.savedPosts || []
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
