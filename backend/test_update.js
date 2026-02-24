require('dotenv').config();
const { query } = require('./src/config/db');

async function testUpdate() {
    try {
        console.log("DB URL from env:", process.env.DATABASE_URL);

        const before = await query("SELECT id, title, icon FROM courses WHERE icon IN ('Globe', 'Table', 'FormInput')");
        console.log("Before Update:", before.rows);

        if (before.rows.length > 0) {
            await query("UPDATE courses SET icon = '🌐' WHERE icon = 'Globe'");
            await query("UPDATE courses SET icon = '📊' WHERE icon = 'Table'");
            await query("UPDATE courses SET icon = '📝' WHERE icon = 'FormInput'");
            console.log("Ran update queries on these rows");

            const after = await query("SELECT id, title, icon FROM courses WHERE id = $1", [before.rows[0].id]);
            console.log("After Update (verification):", after.rows);
        } else {
            console.log("No courses found to update. (Maybe already updated?)");
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        process.exit();
    }
}

testUpdate();
