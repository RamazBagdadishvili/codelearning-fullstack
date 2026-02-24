const router = require('express').Router();
const {
    getNotifications,
    markAsRead,
    markAllRead,
    deleteNotification
} = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// All notification routes are private
router.use(auth);

router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
