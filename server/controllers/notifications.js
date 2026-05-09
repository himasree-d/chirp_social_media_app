const Notification = require('../models/Notification');

// @desc      Get all notifications for user
// @route     GET /api/notifications
// @access    Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .populate('senderId', 'username displayName avatarUrl')
      .populate('postId', 'imageUrl')
      .sort({ createdAt: -1 });

    const formattedNotifications = notifications.map(n => {
      const obj = n.toObject();
      obj.sender = obj.senderId; // Map senderId to sender for frontend consistency
      return obj;
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: formattedNotifications
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Mark all notifications as read
// @route     PATCH /api/notifications/read-all
// @access    Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc      Mark single notification as read
// @route     PATCH /api/notifications/:id/read
// @access    Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
