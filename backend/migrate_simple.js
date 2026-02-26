require('dotenv').config();
const { Client } = require('pg');

const fs = require('fs');
const log = (msg) => {
    fs.appendFileSync('migration_debug.log', msg + '\n');
    console.log(msg);
};

async function run() {
    log('Starting migration...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        log('Connected!');
        await client.query(`
            CREATE TABLE IF NOT EXISTS daily_challenges (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
                challenge_date DATE UNIQUE DEFAULT CURRENT_DATE,
                xp_multiplier INTEGER DEFAULT 2,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        log('Table created or already exists!');
    } catch (err) {
        log('Error: ' + err.message);
    } finally {
        await client.end();
        log('Done.');
    }
}
run();
