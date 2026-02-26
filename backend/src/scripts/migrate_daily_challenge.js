require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

const logPath = 'migration_status.txt';
function log(msg) {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
    console.log(msg);
}

async function runMigration() {
    fs.writeFileSync(logPath, 'Starting Migration...\n');

    // Try Remote First
    log('Attempting remote connection...');
    const remoteClient = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    let connected = false;
    let client = remoteClient;

    try {
        await remoteClient.connect();
        log('✅ Connected to Remote DB.');
        connected = true;
    } catch (err) {
        log(`❌ Remote connection failed: ${err.message}`);
        log('Attempting local connection...');
        const localClient = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'codelearning'
        });
        try {
            await localClient.connect();
            log('✅ Connected to Local DB.');
            client = localClient;
            connected = true;
        } catch (localErr) {
            log(`❌ Local connection failed: ${localErr.message}`);
        }
    }

    if (!connected) {
        log('🛑 Migration aborted: No DB connection.');
        process.exit(1);
    }

    try {
        log('🚀 Creating daily_challenges table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS daily_challenges (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
                challenge_date DATE UNIQUE DEFAULT CURRENT_DATE,
                xp_multiplier INTEGER DEFAULT 2,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

        log('🚀 Adding is_best_answer column to comments...');
        await client.query(`
            ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_best_answer BOOLEAN DEFAULT false;
        `);

        log('🚀 Adding weekly_badges to tournament (Placeholder)...');
        // This is a placeholder for future logic or just ensuring table stability

        log('✨ Migration completed successfully!');
    } catch (err) {
        log(`❌ Query error: ${err.message}`);
    } finally {
        await client.end();
        log('🏁 Process finished.');
        process.exit();
    }
}

runMigration();
