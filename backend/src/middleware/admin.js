// ============================================
// ადმინისტრატორის მიდლვეარი
// ============================================

const admin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'ავტორიზაცია საჭიროა.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'ადმინისტრატორის უფლებები საჭიროა ამ მოქმედებისთვის.' });
    }

    next();
};

module.exports = admin;
