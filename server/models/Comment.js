const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add text for your comment'],
    maxlength: [200, 'Comment can not be more than 200 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);
