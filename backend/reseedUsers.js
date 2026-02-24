require('dotenv').config();
const { pool } = require('./src/config/db');

async function reseedUsers() {
    try {
        await pool.query(`
        INSERT INTO users (id, email, username, password_hash, full_name, role, xp_points, level)
        VALUES (
            'a0000000-0000-0000-0000-000000000001',
            'admin@codelearning.ge',
            'admin',
            '$2a$12$1eEQYuZ1.ZlMOXM40cbThuoMNJ2ivL5xDkw6NdnV98MyW0kLewiHe',
            'ადმინისტრატორი',
            'admin',
            5000,
            10
        ) ON CONFLICT (id) DO NOTHING;
        `);

        await pool.query(`
        INSERT INTO users (id, email, username, password_hash, full_name, role, xp_points, level)
        VALUES (
            'a0000000-0000-0000-0000-000000000002',
            'test@codelearning.ge',
            'testuser',
            '$2a$12$J.6dlpH7AXAHC6eefrXCMeWbtb.2pkMLVolxVQLSQH3tv/TlkD.QS',
            'სატესტო მომხმარებელი',
            'student',
            150,
            2
        ) ON CONFLICT (id) DO NOTHING;
        `);

        console.log('✅ მომხმარებლები (Admin, Test) აღდგა!');
    } catch (e) {
        console.error('❌ შეცდომა:', e);
    } finally {
        process.exit();
    }
}

reseedUsers();
