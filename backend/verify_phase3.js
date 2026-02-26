require('dotenv').config();
const { Client } = require('pg');

const fs = require('fs');

async function verify() {
    let output = '--- Phase 3 Verification ---\n';
    const log = (msg) => {
        console.log(msg);
        output += msg + '\n';
    };

    log('Attempting remote connection...');
    const remoteClient = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    let client = remoteClient;
    let connected = false;

    try {
        await remoteClient.connect();
        log('✅ Connected to Remote DB');
        connected = true;
    } catch (err) {
        log(`❌ Remote failed: ${err.message}`);
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
            log('✅ Connected to Local DB');
            client = localClient;
            connected = true;
        } catch (localErr) {
            log(`❌ Local failed: ${localErr.message}`);
        }
    }

    if (!connected) {
        log('🛑 FAILED: Could not connect to any database.');
        fs.writeFileSync('verify_logs.txt', output);
        process.exit(1);
    }

    try {
        // 1. daily_challenges
        log('\n1. Checking daily_challenges table...');
        const dailyRes = await client.query('SELECT * FROM daily_challenges');
        log(`   Found ${dailyRes.rowCount} challenges.`);
        if (dailyRes.rows.length > 0) {
            log('   Latest Challenge: ' + JSON.stringify(dailyRes.rows[0], null, 2));
        }

        // 2. is_best_answer
        log('\n2. Checking is_best_answer column...');
        const colRes = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'comments' AND column_name = 'is_best_answer'
        `);
        if (colRes.rowCount > 0) {
            log(`   ✅ Column exists: ${colRes.rows[0].column_name} (${colRes.rows[0].data_type})`);
        } else {
            log('   ❌ Column MISSING');
        }

        // 3. User progress checks
        const usersRes = await client.query('SELECT username, xp_points FROM users LIMIT 3');
        log('\n3. User sample:');
        usersRes.rows.forEach(u => log(`   ${u.username}: ${u.xp_points} XP`));

        log('\n✨ Verification complete.');
    } catch (err) {
        log(`❌ Error during queries: ${err.message}`);
    } finally {
        await client.end();
        log('--- Done ---');
        fs.writeFileSync('verify_logs.txt', output);
    }
}

verify();
