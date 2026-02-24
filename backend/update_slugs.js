require('dotenv').config();
const { query } = require('./src/config/db');

async function updateBySlug() {
    try {
        const updates = [
            { slug: 'intro-to-web-and-html-structure', icon: '🌐' },
            { slug: 'html-tables', icon: '📊' },
            { slug: 'html-forms', icon: '📝' },
            { slug: 'javascript-basics', icon: '⚡' }
        ];

        for (const u of updates) {
            await query('UPDATE courses SET icon = $1 WHERE slug = $2', [u.icon, u.slug]);
        }

    } catch (e) {
    } finally {
        process.exit(0);
    }
}

updateBySlug();
