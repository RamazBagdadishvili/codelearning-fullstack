// ============================================
// ლექციების როუტები
// ============================================

const router = require('express').Router();
const { getLesson, submitCode, askAI, explainAI } = require('../controllers/lessonController');
const auth = require('../middleware/auth');

// ლექციის მიღება
router.get('/:courseSlug/:lessonSlug', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        auth(req, res, () => next());
    } else {
        next();
    }
}, getLesson);

// კოდის გაგზავნა
router.post('/:lessonId/submit', auth, submitCode);

// AI დახმარება
router.post('/ask-ai', auth, askAI);
router.post('/explain-ai', auth, explainAI);

module.exports = router;
