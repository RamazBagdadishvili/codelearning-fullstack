require('dotenv').config();
const { pool } = require('../config/db');

async function fixCourses() {
    let client;
    try {
        console.log('Connecting to db...');
        client = await pool.connect();
        console.log('Checking courses...');
        const { rows: courses } = await client.query('SELECT id, title, icon, level, total_lessons FROM courses');

        const iconMap = {
            'Globe': '🌐',
            'Table': '📊',
            'FormInput': '📝',
            'Lightning': '⚡',
            'Code': '💻',
            'Book': '📖'
        };

        for (const course of courses) {
            let newIcon = course.icon;
            if (iconMap[course.icon]) {
                newIcon = iconMap[course.icon];
            } else if (!course.icon || course.icon.length > 2) {
                if (course.title.includes('JavaScript')) newIcon = '⚡';
                else if (course.title.includes('HTML')) newIcon = '🌐';
                else newIcon = '📚';
            }

            console.log(`Updating ${course.title}: ${course.icon} -> ${newIcon}`);
            await client.query('UPDATE courses SET icon = $1 WHERE id = $2', [newIcon, course.id]);

            console.log(`Updating lesson count for ${course.title}...`);
            await client.query(`
                UPDATE courses 
                SET 
                    total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1),
                    total_xp = COALESCE((SELECT SUM(xp_reward) FROM lessons WHERE course_id = $1), 0)
                WHERE id = $1
            `, [course.id]);
        }
        console.log('Done!');
    } catch (err) {
        require('fs').writeFileSync('fix_error.log', String(err.stack));
        console.error('Error:', err);
    } finally {
        if (client) client.release();
        process.exit();
    }
}

fixCourses();
