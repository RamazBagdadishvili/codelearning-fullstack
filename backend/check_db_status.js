require('dotenv').config();
const { pool } = require('./src/config/db');
const fs = require('fs');

async function check() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        const tables = res.rows.map(r => r.table_name);
        fs.writeFileSync('db_status.txt', 'Tables: ' + tables.join(', '));
        client.release();
    } catch (err) {
        fs.writeFileSync('db_status.txt', 'Error: ' + err.message);
    } finally {
        process.exit();
    }
}
check();
