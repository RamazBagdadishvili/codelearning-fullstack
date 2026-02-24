const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function check() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/codelearning'
    });
    try {
        await client.connect();
        console.log('Connected to DB');
        const res = await client.query('SELECT * FROM users');
        console.log('Users count:', res.rows.length);
        if (res.rows.length > 0) {
            const admin = res.rows.find(u => u.username === 'admin');
            const testUser = res.rows.find(u => u.username === 'testuser');
            console.log('Admin:', admin?.email, 'Active:', admin?.is_active, 'Hash:', admin?.password_hash);
            console.log('TestUser:', testUser?.email, 'Active:', testUser?.is_active, 'Hash:', testUser?.password_hash);

            if (admin) {
                const adminMatch = await bcrypt.compare('Admin123!', admin.password_hash);
                console.log('Admin123! match:', adminMatch);
            }
            if (testUser) {
                const testMatch = await bcrypt.compare('Test123!', testUser.password_hash);
                console.log('Test123! match:', testMatch);
            }
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

check();
