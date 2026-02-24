const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/codelearning'
});

async function run() {
    try {
        await client.connect();

        // Explicitly update icons
        await client.query(`UPDATE courses SET icon = '🌐' WHERE icon = 'Globe'`);
        await client.query(`UPDATE courses SET icon = '📊' WHERE icon = 'Table'`);
        await client.query(`UPDATE courses SET icon = '📝' WHERE icon = 'FormInput'`);

        console.log("Updated icons directly.");

        // Now check why JavaScript has 0 lessons
        const jsCourse = await client.query(`SELECT id FROM courses WHERE title ILIKE '%JavaScript%' LIMIT 1`);
        if (jsCourse.rows.length > 0) {
            const jsId = jsCourse.rows[0].id;
            const lessonCount = await client.query(`SELECT COUNT(*) as cnt FROM lessons WHERE course_id = $1`, [jsId]);
            console.log(`JS Course ID: ${jsId}, Real lessons in DB for it: ${lessonCount.rows[0].cnt}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
