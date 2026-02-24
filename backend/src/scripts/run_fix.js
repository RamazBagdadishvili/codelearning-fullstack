require('dotenv').config({ path: '../../.env' });
const { pool } = require('../config/db');

async function main() {
    console.log("Connecting...");
    const client = await pool.connect();
    console.log("Connected!");

    try {
        const res1 = await client.query("UPDATE courses SET icon = '🌐' WHERE slug = 'intro-to-web-and-html-structure'");
        console.log("Upd 1:", res1.rowCount);

        const res2 = await client.query("UPDATE courses SET icon = '📊' WHERE slug = 'html-tables'");
        console.log("Upd 2:", res2.rowCount);

        const res3 = await client.query("UPDATE courses SET icon = '📝' WHERE slug = 'html-forms'");
        console.log("Upd 3:", res3.rowCount);

        const res4 = await client.query("UPDATE lessons SET course_id = '714870b5-6f41-4275-a5e6-5ef43e452427' WHERE course_id = 'c0000000-0000-0000-0003-000000000001'");
        console.log("Upd 4:", res4.rowCount);

        const res5 = await client.query(`
        UPDATE courses 
        SET 
            total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = courses.id),
            total_xp = COALESCE((SELECT SUM(xp_reward) FROM lessons WHERE course_id = courses.id), 0)
    `);
        console.log("Upd stats:", res5.rowCount);

    } catch (e) {
        console.error("SQL Error:", e);
    } finally {
        client.release();
        console.log("Done");
    }
}

main().then(() => process.exit(0)).catch(e => { console.error("Fatal:", e); process.exit(1); });
