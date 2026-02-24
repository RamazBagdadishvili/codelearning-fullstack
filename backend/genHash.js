const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function gen() {
    try {
        console.log('Starting hashing...');
        const adminHash = await bcrypt.hash('Admin123!', 12);
        const testHash = await bcrypt.hash('Test123!', 12);
        const data = 'ADMIN_HASH=' + adminHash + '\nTEST_HASH=' + testHash;
        console.log(data);
        fs.writeFileSync(path.join(__dirname, 'hashes.txt'), data);
        console.log('Done!');
    } catch (err) {
        console.error('Error in gen:', err);
    }
}
gen().catch(err => console.error(err));
