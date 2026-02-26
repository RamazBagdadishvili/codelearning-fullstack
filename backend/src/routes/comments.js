// ============================================
// კომენტარების როუტები
// ============================================

const router = require('express').Router();
const {
    getLessonComments,
    addComment,
    markAsBestAnswer,
    deleteComment
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

// კომენტარების მიღება ლექციისთვის
router.get('/lesson/:lessonId', getLessonComments);

// ახალი კომენტარი
router.post('/', auth, addComment);

// საუკეთესო პასუხად მონიშვნა
router.patch('/:commentId/best-answer', auth, markAsBestAnswer);

// კომენტარის წაშლა
router.delete('/:commentId', auth, deleteComment);

module.exports = router;
