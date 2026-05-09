const User = require('../models/User');
const { sendTokenResponse } = require('../utils/generateToken');

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    const { username, displayName, email, password } = req.body;

    // Create user
    const user = await User.create({
      username,
      displayName,
      email,
      passwordHash: password
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    if (err.code === 11000 && err.keyValue) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ 
        success: false, 
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.` 
      });
    }
    res.status(400).json({ success: false, error: err.message || 'Registration failed' });
  }
};

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate email & password
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an username and password' });
    }

    // Check for user
    const user = await User.findOne({ username }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Get current logged in user
// @route     GET /api/auth/me
// @access    Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Log user out / clear cookie
// @route     GET /api/auth/logout
// @access    Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};
