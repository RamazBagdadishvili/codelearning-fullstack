const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/codelearning'
});

async function run() {
    try {
        await client.connect();
        const res = await client.query('SELECT title, icon, total_lessons FROM courses');
        require('fs').writeFileSync('course_status.json', JSON.stringify(res.rows, null, 2));
        console.log("DB Checked - Wrote to course_status.json");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
