const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    maxlength: [280, 'Caption can not be more than 280 characters'],
    default: ''
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  thumbnailUrl: {
    type: String
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  lingerers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private', 'ripple'],
    default: 'public'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
