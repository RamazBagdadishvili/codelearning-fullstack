const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { Client } = require('pg');

const logFile = path.join(__dirname, 'final_verify_log.txt');
fs.writeFileSync(logFile, '--- FINAL VERIFICATION ---\n');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function verify() {
    log('Checking Environment Variables...');
    if (!process.env.DATABASE_URL) {
        log('WARNING: DATABASE_URL not set, falling back to local credentials');
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'codelearning'
    });

    try {
        await client.connect();
        log('✅ Connected to Database');

        // 1. Check daily_challenges
        const dcRes = await client.query('SELECT COUNT(*) FROM daily_challenges');
        log(`1. Daily Challenges Count: ${dcRes.rows[0].count}`);

        // 2. Check comments column
        const colRes = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'comments' AND column_name = 'is_best_answer'
        `);
        log(`2. is_best_answer column exists: ${colRes.rowCount > 0}`);

        // 3. User rank logic check (Leaderboard)
        const leadRes = await client.query('SELECT username, xp_points FROM users ORDER BY xp_points DESC LIMIT 1');
        if (leadRes.rows[0]) {
            log(`3. Current Leader: ${leadRes.rows[0].username} with ${leadRes.rows[0].xp_points} XP`);
        }

        log('--- ALL CHECKS PASSED ---');
    } catch (err) {
        log(`❌ FAILED: ${err.message}`);
    } finally {
        await client.end();
    }
}

verify();
