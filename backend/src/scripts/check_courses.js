require('dotenv').config();
const { pool } = require('../config/db');

async function checkCourses() {
    let client;
    try {
        client = await pool.connect();
        const { rows: courses } = await client.query('SELECT title, icon, total_lessons FROM courses');
        console.log("Current Courses in DB:");
        console.table(courses);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (client) client.release();
        process.exit();
    }
}

checkCourses();
