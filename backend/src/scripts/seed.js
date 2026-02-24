require('dotenv').config();
const { pool } = require('../config/db');
const jsLessons = require('./data/js-all');
const reactLessons = require('./data/react-all');
const advancedLessons = require('./data/advanced-all');
const htmlCssLessons = require('./data/html-css-all');

async function seedLessons() {
    const client = await pool.connect();

    try {
        console.log('🔄 ვიწყებ გაკვეთილების განახლებას...');
        await client.query('BEGIN');

        // წავშალოთ ძველი გაკვეთილები, რომ თავიდან დავამატოთ სუფთად 
        // (უკვე არსებული SQL ფაილის გაკვეთილებსაც ეს ჩაანაცვლებს ახლით)
        // ვშლით მხოლოდ იმ გაკვეთილებს, რომლებსაც ახლა ვამატებთ, რათა 
        // დუბლიკატები თავიდან ავიცილოთ
        console.log('🗑️ ვშლი ძველ გენერირებულ გაკვეთილებს...');


        const allLessons = [...htmlCssLessons, ...jsLessons, ...reactLessons, ...advancedLessons];
        console.log(`📝 სულ დასამატებელია ${allLessons.length} გაკვეთილი.`);

        for (const lesson of allLessons) {
            await client.query(`
                INSERT INTO lessons (
                    id, course_id, title, slug, content, content_type, 
                    starter_code, solution_code, challenge_text, language, xp_reward, sort_order
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `, [
                lesson.id, lesson.course_id, lesson.title, lesson.slug, lesson.content, lesson.content_type,
                lesson.starter_code, lesson.solution_code, lesson.challenge_text, lesson.language, lesson.xp_reward, lesson.sort_order
            ]);
        }

        // გადავთვალოთ კურსების სტატისტიკა
        console.log('📊 ვაახლებ კურსების სტატისტიკას...');
        await client.query(`
            UPDATE courses SET total_lessons = (
                SELECT COUNT(*) FROM lessons WHERE lessons.course_id = courses.id
            );
        `);
        await client.query(`
            UPDATE courses SET total_xp = (
                SELECT COALESCE(SUM(xp_reward), 0) FROM lessons WHERE lessons.course_id = courses.id
            );
        `);

        await client.query('COMMIT');
        console.log('✅ ყველა გაკვეთილი წარმატებით დაემატა!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ შეცდომა გაკვეთილების დამატებისას:', e);
    } finally {
        client.release();
        // აპლიკაციის დახურვა
        process.exit();
    }
}

seedLessons();
