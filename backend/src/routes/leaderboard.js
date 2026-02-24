// ლიდერბორდის როუტები
const router = require('express').Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const auth = require('../middleware/auth');

router.get('/', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) { auth(req, res, () => next()); } else { next(); }
}, getLeaderboard);

module.exports = router;
