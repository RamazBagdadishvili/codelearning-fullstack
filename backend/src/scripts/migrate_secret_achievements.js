const { query } = require('../config/db');

async function migrate() {
    console.log('--- Starting Secret Achievements Migration ---');
    try {
        // Add is_secret column to achievements table
        await query(`
            ALTER TABLE achievements 
            ADD COLUMN IF NOT EXISTS is_secret BOOLEAN DEFAULT false;
        `);
        console.log('✅ Added is_secret column to achievements table');

        console.log('--- Migration Completed Successfully ---');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
