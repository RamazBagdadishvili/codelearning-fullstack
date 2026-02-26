const { pool } = require('../config/db');
const fs = require('fs');

async function check() {
    try {
        const client = await pool.connect();
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'daily_challenges'
        `);
        const output = 'Columns: ' + res.rows.map(r => r.column_name).join(', ');
        fs.writeFileSync('results.txt', output);
        client.release();
    } catch (err) {
        fs.writeFileSync('results.txt', 'Error: ' + err.message);
    } finally {
        process.exit();
    }
}
check();
