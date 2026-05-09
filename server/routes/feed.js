const express = require('express');
const { getFeed } = require('../controllers/feed');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getFeed);

module.exports = router;
