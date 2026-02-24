require('dotenv').config();
const { pool } = require('./src/config/db');
const fs = require('fs');

async function diag() {
    let log = '';
    try {
        const client = await pool.connect();
        log += '✅ Connected to DB\n';

        const tables = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        log += 'Tables: ' + tables.rows.map(r => r.tablename).join(', ') + '\n';

        const columns = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
        log += 'User columns: ' + columns.rows.map(r => `${r.column_name} (${r.data_type})`).join(', ') + '\n';

        const users = await client.query("SELECT id, email, username, is_active FROM users");
        log += 'Users: ' + JSON.stringify(users.rows) + '\n';

        client.release();
    } catch (e) {
        log += '❌ Error: ' + e.message + '\n';
    }
    fs.writeFileSync('diag_result.txt', log);
    process.exit();
}

diag();
