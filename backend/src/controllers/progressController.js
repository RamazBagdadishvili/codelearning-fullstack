// ============================================
// პროგრესის კონტროლერი
// ============================================

const { query } = require('../config/db');

// მომხმარებლის სრული პროგრესი
// GET /api/progress
const getUserProgress = async (req, res, next) => {
    try {
        // კურსების პროგრესი
        const coursesResult = await query(
            `SELECT c.id, c.title, c.slug, c.icon, c.color, c.level, c.total_lessons,
              ce.progress_percentage, ce.enrolled_at,
              (SELECT COUNT(*) FROM user_progress up WHERE up.user_id = $1 AND up.course_id = c.id AND up.status = 'completed') as completed_lessons
       FROM course_enrollments ce
       JOIN courses c ON c.id = ce.course_id
       WHERE ce.user_id = $1
       ORDER BY ce.enrolled_at DESC`,
            [req.user.id]
        );

        // სტატისტიკა
        const statsResult = await query(
            `SELECT 
        (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed') as total_completed,
        (SELECT COALESCE(SUM(xp_reward), 0) FROM lessons l JOIN user_progress up ON l.id = up.lesson_id WHERE up.user_id = $1 AND up.status = 'completed') as total_xp_earned,
        (SELECT COUNT(DISTINCT course_id) FROM user_progress WHERE user_id = $1) as active_courses,
        (SELECT COUNT(*) FROM code_submissions WHERE user_id = $1 AND passed = true) as passed_submissions`,
            [req.user.id]
        );

        // ბოლო აქტივობა
        const recentResult = await query(
            `SELECT up.*, l.title as lesson_title, l.slug as lesson_slug, c.title as course_title, c.slug as course_slug
       FROM user_progress up
       JOIN lessons l ON l.id = up.lesson_id
       JOIN courses c ON c.id = up.course_id
       WHERE up.user_id = $1
       ORDER BY up.last_attempt_at DESC LIMIT 10`,
            [req.user.id]
        );

        res.json({
            courses: coursesResult.rows,
            stats: statsResult.rows[0],
            recentActivity: recentResult.rows
        });
    } catch (error) {
        next(error);
    }
};

// კურსის პროგრესი
// GET /api/progress/course/:courseId
const getCourseProgress = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const result = await query(
            `SELECT l.id, l.title, l.slug, l.sort_order, l.xp_reward, l.content_type,
              up.status, up.best_score, up.completed_at, up.attempts
       FROM lessons l
       LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $1
       WHERE l.course_id = $2 AND l.is_published = true
       ORDER BY l.sort_order`,
            [req.user.id, courseId]
        );

        const total = result.rowCount;
        const completed = result.rows.filter(r => r.status === 'completed').length;

        // enrollment-ის პროგრესის განახლება
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        await query(
            `UPDATE course_enrollments SET progress_percentage = $1, completed_at = CASE WHEN $1 = 100 THEN NOW() ELSE NULL END
       WHERE user_id = $2 AND course_id = $3`,
            [percentage, req.user.id, courseId]
        );

        res.json({
            lessons: result.rows,
            total,
            completed,
            percentage
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserProgress, getCourseProgress };
