const Post = require('../models/Post');
const Follow = require('../models/Follow');
const mongoose = require('mongoose');

// @desc      Get feed (follows + recency)
// @route     GET /api/feed
// @access    Private
exports.getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const currentUserId = new mongoose.Types.ObjectId(req.user.id);

    // Aggregation pipeline for feed
    const posts = await Post.aggregate([
      // 1. Lookup author details
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      
      // 2. Lookup follow status
      {
        $lookup: {
          from: 'follows',
          let: { author_id: '$authorId' },
          pipeline: [
            { $match: { 
                $expr: { 
                  $and: [
                    { $eq: ['$followingId', '$$author_id'] },
                    { $eq: ['$followerId', currentUserId] },
                    { $eq: ['$status', 'accepted'] }
                  ] 
                } 
            }}
          ],
          as: 'followStatus'
        }
      },
      
      // 3. Add flags for logic
      {
        $addFields: {
          isFollowed: { $gt: [{ $size: '$followStatus' }, 0] },
          isSelf: { $eq: ['$authorId', currentUserId] },
          isPublic: { $eq: ['$author.isPrivate', false] }
        }
      },
      
      // 4. Match conditions
      {
        $match: {
          isSelf: false, // Exclude user's own posts
          $or: [
            { isFollowed: true }, // Include if followed
            { isPublic: true }    // Include if public (these become recommended)
          ],
          // Filter out expired ripple posts
          $nor: [
            {
              visibility: 'ripple',
              createdAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) }
            }
          ]
        }
      },
      
      // 5. Add Priority (1 for followed, 2 for recommended)
      {
        $addFields: {
          priority: { $cond: [{ $eq: ['$isFollowed', true] }, 1, 2] },
          isRecommended: { $cond: [{ $eq: ['$isFollowed', false] }, true, false] }
        }
      },
      
      // 6. Sort by Priority (Followed first), then Date
      {
        $sort: { priority: 1, createdAt: -1 }
      },
      
      // 7. Paginate
      { $skip: skip },
      { $limit: limit + 1 },
      
      // 8. Project final fields
      {
        $project: {
          _id: 1,
          caption: 1,
          imageUrl: 1,
          thumbnailUrl: 1,
          likes: 1,
          lingerers: 1,
          commentsCount: 1,
          tags: 1,
          visibility: 1,
          createdAt: 1,
          isRecommended: 1,
          authorId: {
            _id: '$author._id',
            username: '$author.username',
            displayName: '$author.displayName',
            avatarUrl: '$author.avatarUrl'
          }
        }
      }
    ]);

    const hasMore = posts.length > limit;
    if (hasMore) {
      posts.pop(); // Remove the extra item
    }

    res.status(200).json({
      success: true,
      count: posts.length,
      hasMore,
      data: posts
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
