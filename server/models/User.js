const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [30, 'Username can not be more than 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  displayName: {
    type: String,
    required: [true, 'Please add a display name'],
    trim: true,
    maxlength: [50, 'Display name can not be more than 50 characters']
  },
  bio: {
    type: String,
    maxlength: [160, 'Bio can not be more than 160 characters'],
    default: ''
  },
  avatarUrl: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' // Default avatar
  },
  coverMoodUrls: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    default: []
  },
  coverImageUrl: {
    type: String,
    default: ''
  },
  passwordHash: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  savedPosts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Post',
    default: []
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

function arrayLimit(val) {
  return val.length <= 5;
}

// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
  if (!this.isModified('passwordHash')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
