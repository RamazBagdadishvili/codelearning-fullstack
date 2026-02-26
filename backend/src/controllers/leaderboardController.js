// ============================================
// ლიდერბორდის კონტროლერი
// ============================================

const { query } = require('../config/db');

// ტოპ მომხმარებლები XP-ის მიხედვით
// GET /api/leaderboard
const getLeaderboard = async (req, res, next) => {
    try {
        const { limit = 50, offset = 0, timeframe = 'all' } = req.query;

        let dateCondition = '';
        if (timeframe === 'week') dateCondition = "AND up.completed_at >= NOW() - INTERVAL '7 days'";
        if (timeframe === 'month') dateCondition = "AND up.completed_at >= NOW() - INTERVAL '30 days'";

        const xpQuery = timeframe === 'all'
            ? 'u.xp_points'
            : `COALESCE((SELECT SUM(l.xp_reward) FROM user_progress up JOIN lessons l ON l.id = up.lesson_id WHERE up.user_id = u.id AND up.status = 'completed' ${dateCondition}), 0)`;

        const result = await query(
            `SELECT * FROM (
                SELECT u.id, u.username, u.full_name, u.avatar_url, u.level, u.streak_days,
                  ${xpQuery} as xp_points,
                  (SELECT COUNT(*) FROM user_progress up WHERE up.user_id = u.id AND up.status = 'completed' ${dateCondition}) as completed_lessons,
                  (SELECT COUNT(*) FROM user_achievements WHERE user_id = u.id) as achievements_count,
                  ROW_NUMBER() OVER (ORDER BY ${xpQuery} DESC, u.id ASC) as rank
                FROM users u
                WHERE u.is_active = true
            ) as ranked_users
            ${timeframe !== 'all' ? 'WHERE xp_points > 0' : ''}
            ORDER BY rank ASC
            LIMIT $1 OFFSET $2`,
            [parseInt(limit), parseInt(offset)]
        );

        // მომხმარებლის პოზიცია (თუ ავტორიზებულია)
        let userRank = null;
        if (req.user) {
            const rankResult = await query(
                `SELECT rank FROM (
                   SELECT u.id, ROW_NUMBER() OVER (ORDER BY ${xpQuery} DESC, u.id ASC) as rank
                   FROM users u WHERE u.is_active = true
                 ) as ranked WHERE id = $1`,
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
