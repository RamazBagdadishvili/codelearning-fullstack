const { query } = require('../config/db');

// @desc    Get current user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const result = await query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
            [req.user.id]
        );
        res.json({ notifications: result.rows });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        await query(
            'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        res.json({ message: 'შეტყობინება წაკითხულია' });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllRead = async (req, res, next) => {
    try {
        await query(
            'UPDATE notifications SET is_read = true WHERE user_id = $1',
            [req.user.id]
        );
        res.json({ message: 'ყველა შეტყობინება წაკითხულია' });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        await query(
            'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );
        res.json({ message: 'შეტყობინება წაშლილია' });
    } catch (error) {
        next(error);
    }
};
