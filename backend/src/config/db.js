// ============================================
// PostgreSQL კონფიგურაცია
// ============================================

const { Pool } = require('pg');

const isRemoteDB = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.NODE_ENV === 'production' && isRemoteDB) ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// კავშირის შემოწმება
pool.on('connect', () => {
    console.log('✅ PostgreSQL-თან კავშირი წარმატებულია');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL კავშირის შეცდომა:', err.message);
});

// მოხერხებული query ფუნქცია
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Query:', { text: text.substring(0, 80), duration: `${duration}ms`, rows: result.rowCount });
        }
        return result;
    } catch (error) {
        console.error('❌ Query შეცდომა:', error.message);
        throw error;
    }
};

module.exports = { pool, query };
