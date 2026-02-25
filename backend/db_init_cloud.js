require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function initializeDatabase() {
    try {
        console.log('🚀 Starting Database Initialization...');

        // Read schema.sql
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const seedPath = path.join(__dirname, '..', 'seed.sql');

        if (fs.existsSync(schemaPath)) {
            console.log('📄 Reading schema.sql...');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await pool.query(schemaSql);
            console.log('✅ Schema applied successfully.');
        } else {
            console.log('⚠️ schema.sql not found in root.');
        }

        if (fs.existsSync(seedPath)) {
            console.log('🌱 Reading seed.sql...');
            const seedSql = fs.readFileSync(seedPath, 'utf8');
            await pool.query(seedSql);
            console.log('✅ Seed data applied successfully.');
        } else {
            console.log('⚠️ seed.sql not found in root.');
        }

        console.log('🎉 Database is ready!');
    } catch (err) {
        console.error('❌ Error during initialization:', err.message);
    } finally {
        await pool.end();
    }
}

initializeDatabase();
