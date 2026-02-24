require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkConstraint() {
    try {
        const res = await pool.query(`
      SELECT pg_get_constraintdef(c.oid) 
      FROM pg_constraint c 
      WHERE c.conname = 'lessons_content_type_check'
    `);
        require('fs').writeFileSync('constraint_def.txt', JSON.stringify(res.rows, null, 2));
    } catch (err) {
        require('fs').writeFileSync('constraint_def.txt', err.toString());
    } finally {
        process.exit(1);
    }
}

checkConstraint();
