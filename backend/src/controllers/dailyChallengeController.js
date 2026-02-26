// ============================================
// Daily Challenge კონტროლერი
// ============================================

const { query } = require('../config/db');

// დღევანდელი დავალების მიღება
const getDailyChallenge = async (req, res, next) => {
    try {
        let challenge = await query(`
            SELECT dc.*, l.title, l.slug, l.xp_reward, c.slug as course_slug, c.title as course_title
            FROM daily_challenges dc
            JOIN lessons l ON dc.lesson_id = l.id
            JOIN courses c ON l.course_id = c.id
            WHERE dc.challenge_date = CURRENT_DATE
        `);

        // თუ დღევანდელი არ არის, შევქმნათ ახალი შემთხვევითი
        if (challenge.rows.length === 0) {
            const randomLesson = await query(`
                SELECT l.id FROM lessons l 
                WHERE l.is_published = true 
                ORDER BY RANDOM() LIMIT 1
            `);

            if (randomLesson.rows.length > 0) {
                const newDc = await query(`
                    INSERT INTO daily_challenges (lesson_id, challenge_date, xp_multiplier)
                    VALUES ($1, CURRENT_DATE, 2)
                    RETURNING *
                `, [randomLesson.rows[0].id]);

                challenge = await query(`
                    SELECT dc.*, l.title, l.slug, l.xp_reward, c.slug as course_slug, c.title as course_title
                    FROM daily_challenges dc
                    JOIN lessons l ON dc.lesson_id = l.id
                    JOIN courses c ON l.course_id = c.id
                    WHERE dc.id = $1
                `, [newDc.rows[0].id]);
            }
        }

        res.json({ challenge: challenge.rows[0] || null });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDailyChallenge };
