// ============================================
// ლიდერბორდის კონტროლერი
// ============================================

const { query } = require('../config/db');

// ტოპ მომხმარებლები XP-ის მიხედვით
// GET /api/leaderboard
const getLeaderboard = async (req, res, next) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const result = await query(
            `SELECT u.id, u.username, u.full_name, u.avatar_url, u.xp_points, u.level, u.streak_days,
              (SELECT COUNT(*) FROM user_progress WHERE user_id = u.id AND status = 'completed') as completed_lessons,
              (SELECT COUNT(*) FROM user_achievements WHERE user_id = u.id) as achievements_count,
              ROW_NUMBER() OVER (ORDER BY u.xp_points DESC) as rank
       FROM users u
       WHERE u.is_active = true
       ORDER BY u.xp_points DESC
       LIMIT $1 OFFSET $2`,
            [parseInt(limit), parseInt(offset)]
        );

        // მომხმარებლის პოზიცია (თუ ავტორიზებულია)
        let userRank = null;
        if (req.user) {
            const rankResult = await query(
                `SELECT rank FROM (
           SELECT id, ROW_NUMBER() OVER (ORDER BY xp_points DESC) as rank
           FROM users WHERE is_active = true
         ) ranked WHERE id = $1`,
                [req.user.id]
            );
            userRank = rankResult.rows[0]?.rank || null;
        }

        res.json({
            leaderboard: result.rows,
            userRank,
            total: result.rowCount
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLeaderboard };
