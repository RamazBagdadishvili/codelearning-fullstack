const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function updatePasswords() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/codelearning'
    });
    try {
        await client.connect();

        // Admin password
        const adminHash = await bcrypt.hash('Admin123!', 12);
        await client.query('UPDATE users SET password_hash = $1 WHERE username = $2', [adminHash, 'admin']);

        // Testuser password
        const testHash = await bcrypt.hash('Test123!', 12);
        await client.query('UPDATE users SET password_hash = $1 WHERE username = $2', [testHash, 'testuser']);

        // Also save the hashes locally just in case
        const fs = require('fs');
        fs.writeFileSync('updated_hashes.txt', JSON.stringify({ adminHash, testHash }));

    } catch (err) {
        const fs = require('fs');
        fs.writeFileSync('error.txt', err.message);
    } finally {
        await client.end();
    }
}

updatePasswords();
