// მიღწევების როუტები
const router = require('express').Router();
const { getAllAchievements, checkAchievements } = require('../controllers/achievementController');
const auth = require('../middleware/auth');

router.get('/', auth, getAllAchievements);
router.post('/check', auth, checkAchievements);

module.exports = router;
