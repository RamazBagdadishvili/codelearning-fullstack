// პროგრესის როუტები
const router = require('express').Router();
const { getUserProgress, getCourseProgress } = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.get('/', auth, getUserProgress);
router.get('/course/:courseId', auth, getCourseProgress);

module.exports = router;
