// ============================================
// ინსტრუქტორის მიდლვეარი
// admin ან instructor — ორივე გადის
// ============================================

const instructor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'ავტორიზაცია საჭიროა.' });
    }

    if (!['admin', 'instructor'].includes(req.user.role)) {
        return res.status(403).json({ error: 'ინსტრუქტორის ან ადმინისტრატორის უფლებები საჭიროა.' });
    }

    next();
};

module.exports = instructor;
