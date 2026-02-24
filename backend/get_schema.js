require('dotenv').config();
const { pool } = require('./src/config/db');

async function getSchema() {
    try {
        const result = await pool.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name IN ('courses', 'lessons')
            ORDER BY table_name, ordinal_position;
        `);
        console.log("SCHEMA DUMP:");
        console.table(result.rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

getSchema();
