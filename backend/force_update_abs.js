const fs = require('fs');
const logPath = 'C:\\Users\\Ramaz\\OneDrive\\Desktop\\Full-Stach for Teach site\\backend\\force_log.txt';

function log(msg) { fs.appendFileSync(logPath, msg + '\n'); }

try {
    log("Starting force update");
    const { Client } = require('C:\\Users\\Ramaz\\OneDrive\\Desktop\\Full-Stach for Teach site\\backend\\node_modules\\pg\\lib\\index.js');
    log("Required pg");

    const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/codelearning' });

    client.connect().then(() => {
        log("Connected to DB");
        return client.query("UPDATE courses SET icon = '🌐' WHERE slug = 'intro-to-web-and-html-structure'");
    }).then(res => {
        log("Update HTML Intro: " + res.rowCount);
        return client.query("UPDATE courses SET icon = '📊' WHERE slug = 'html-tables'");
    }).then(res => {
        log("Update Tables: " + res.rowCount);
        return client.query("UPDATE courses SET icon = '📝' WHERE slug = 'html-forms'");
    }).then(res => {
        log("Update Forms: " + res.rowCount);
        return client.query("UPDATE lessons SET course_id = '714870b5-6f41-4275-a5e6-5ef43e452427' WHERE course_id = 'c0000000-0000-0000-0003-000000000001'");
    }).then(res => {
        log("Update JS Lessons: " + res.rowCount);
        return client.end();
    }).then(() => {
        log("Done");
    }).catch(e => {
        log("Promise Error: " + e.stack);
        client.end();
    });

} catch (e) {
    log("Sync Error: " + e.stack);
}
