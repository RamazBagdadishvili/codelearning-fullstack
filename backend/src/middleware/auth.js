// ============================================
// JWT Authentication მიდლვეარი
// ============================================

const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const auth = async (req, res, next) => {
    try {
        // ტოკენის მიღება header-დან
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'ავტორიზაცია საჭიროა. გთხოვთ შეხვიდეთ სისტემაში.' });
        }

        const token = authHeader.split(' ')[1];

        // ტოკენის შემოწმება
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // მომხმარებლის მოძიება
        const result = await query('SELECT id, email, username, role, xp_points, level FROM users WHERE id = $1 AND is_active = true', [decoded.userId]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'მომხმარებელი ვერ მოიძებნა ან დეაქტივირებულია.' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'სესია ამოიწურა. გთხოვთ ხელახლა შეხვიდეთ.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'არასწორი ტოკენი.' });
        }
        return res.status(500).json({ error: 'სერვერის შეცდომა ავტორიზაციისას.' });
    }
};

module.exports = auth;
