require('dotenv').config();
const { pool } = require('./src/config/db');

async function reseed() {
    try {
        console.log('Starting reseed...');
        // Try to update is_active for all users first
        try {
            await pool.query('UPDATE users SET is_active = true');
            console.log('Updated active status for existing users');
        } catch (e) {
            console.log('Update failed (maybe column missing?):', e.message);
        }

        const adminHash = '$2a$12$1eEQYuZ1.ZlMOXM40cbThuoMNJ2ivL5xDkw6NdnV98MyW0kLewiHe'; // Admin123!
        const testHash = '$2a$12$J.6dlpH7AXAHC6eefrXCMeWbtb.2pkMLVolxVQLSQH3tv/TlkD.QS'; // Test123!

        await pool.query(`
            INSERT INTO users (id, email, username, password_hash, full_name, role, is_active)
            VALUES (
                'a0000000-0000-0000-0000-000000000001',
                'admin@codelearning.ge',
                'admin',
                $1,
                'ადმინისტრატორი',
                'admin',
                true
            ) ON CONFLICT (id) DO UPDATE SET password_hash = $1, is_active = true
        `, [adminHash]);

        await pool.query(`
            INSERT INTO users (id, email, username, password_hash, full_name, role, is_active)
            VALUES (
                'a0000000-0000-0000-0000-000000000002',
                'test@codelearning.ge',
                'testuser',
                $1,
                'სატესტო მომხმარებელი',
                'student',
                true
            ) ON CONFLICT (id) DO UPDATE SET password_hash = $1, is_active = true
        `, [testHash]);

        console.log('✅ Reseed successful');
    } catch (e) {
        console.error('❌ Reseed failed:', e.message);
    } finally {
        process.exit(0);
    }
}

reseed();
