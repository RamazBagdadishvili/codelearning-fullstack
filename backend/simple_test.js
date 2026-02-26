const fs = require('fs');
fs.writeFileSync('simple_log.txt', 'Started\n');
try {
    const x = require('./src/config/db');
    fs.appendFileSync('simple_log.txt', 'Loaded DB config\n');
} catch (e) {
    fs.appendFileSync('simple_log.txt', 'Error: ' + e.message + '\n');
}
fs.appendFileSync('simple_log.txt', 'Ended\n');
process.exit();
