// ============================================
// მიღწევების კონტროლერი
// ============================================

const { query } = require('../config/db');

// ყველა მიღწევა
// GET /api/achievements
const getAllAchievements = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT a.*, 
              CASE WHEN ua.id IS NOT NULL THEN true ELSE false END as earned,
              ua.earned_at
       FROM achievements a
       LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
       ORDER BY a.sort_order`,
            [req.user.id]
        );

        // მომხმარებლის სტატისტიკის მიღება progress ბარისთვის
        const statsResult = await query(
            `SELECT 
                (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed') as lessons_completed,
                (SELECT COUNT(DISTINCT course_id) FROM course_enrollments WHERE user_id = $1 AND progress_percentage = 100) as courses_completed,
                (SELECT streak_days FROM users WHERE id = $1) as streak_days,
                (SELECT xp_points FROM users WHERE id = $1) as xp_earned,
                (SELECT COUNT(*) FROM code_submissions WHERE user_id = $1) as code_submissions`,
            [req.user.id]
        );
        const stats = statsResult.rows[0];

        const achievementsWithProgress = result.rows.map(a => {
            let currentValue = 0;
            switch (a.criteria_type) {
                case 'lessons_completed': currentValue = parseInt(stats.lessons_completed); break;
                case 'courses_completed': currentValue = parseInt(stats.courses_completed); break;
                case 'streak_days': currentValue = parseInt(stats.streak_days); break;
                case 'xp_earned': currentValue = parseInt(stats.xp_earned); break;
                case 'code_submissions': currentValue = parseInt(stats.code_submissions); break;
            }
            return { ...a, current_value: currentValue };
        });

        res.json({ achievements: achievementsWithProgress });
    } catch (error) {
        next(error);
    }
};

// მიღწევების შემოწმება და მინიჭება
// POST /api/achievements/check
const checkAchievements = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const newAchievements = [];

        // მომხმარებლის სტატისტიკის მიღება
        const statsResult = await query(
            `SELECT 
        (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed') as lessons_completed,
        (SELECT COUNT(DISTINCT course_id) FROM course_enrollments WHERE user_id = $1 AND progress_percentage = 100) as courses_completed,
        (SELECT streak_days FROM users WHERE id = $1) as streak_days,
        (SELECT xp_points FROM users WHERE id = $1) as xp_earned,
        (SELECT COUNT(*) FROM code_submissions WHERE user_id = $1) as code_submissions`,
            [userId]
        );
        const stats = statsResult.rows[0];

        // მიუღებელი მიღწევების მოძიება
        const unearned = await query(
            `SELECT a.* FROM achievements a 
       WHERE a.id NOT IN (SELECT achievement_id FROM user_achievements WHERE user_id = $1)`,
            [userId]
        );

        for (const achievement of unearned.rows) {
            let earned = false;

            switch (achievement.criteria_type) {
                case 'lessons_completed':
                    earned = parseInt(stats.lessons_completed) >= achievement.criteria_value;
                    break;
                case 'courses_completed':
                    earned = parseInt(stats.courses_completed) >= achievement.criteria_value;
                    break;
                case 'streak_days':
                    earned = parseInt(stats.streak_days) >= achievement.criteria_value;
                    break;
                case 'xp_earned':
                    earned = parseInt(stats.xp_earned) >= achievement.criteria_value;
                    break;
                case 'code_submissions':
                    earned = parseInt(stats.code_submissions) >= achievement.criteria_value;
                    break;
            }

            if (earned) {
                await query(
                    'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [userId, achievement.id]
                );
                await query('UPDATE users SET xp_points = xp_points + $1 WHERE id = $2', [achievement.xp_reward, userId]);
                newAchievements.push(achievement);
            }
        }

        res.json({ newAchievements, checked: true });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllAchievements, checkAchievements };
