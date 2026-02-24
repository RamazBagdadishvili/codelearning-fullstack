const fs = require('fs');
function log(msg) { fs.appendFileSync('force_log.txt', msg + '\n'); }

try {
    log("Starting force update");
    const { Client } = require('pg');
    log("Required pg");

    const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/codelearning' });

    client.connect().then(() => {
        log("Connected to DB");
        return client.query("UPDATE courses SET icon = '🌐' WHERE slug = 'intro-to-web-and-html-structure'");
    }).then(res => {
        log("Update 1: " + res.rowCount);
        return client.query("UPDATE courses SET icon = '📊' WHERE slug = 'html-tables'");
    }).then(res => {
        log("Update 2: " + res.rowCount);
        return client.query("UPDATE courses SET icon = '📝' WHERE slug = 'html-forms'");
    }).then(res => {
        log("Update 3: " + res.rowCount);
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
