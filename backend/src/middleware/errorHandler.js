// ============================================
// გლობალური Error Handler მიდლვეარი
// ============================================

const errorHandler = (err, req, res, next) => {
    console.error('❌ შეცდომა:', err);

    // Validation შეცდომები
    if (err.type === 'validation') {
        return res.status(400).json({
            error: 'ვალიდაციის შეცდომა',
            details: err.errors
        });
    }

    // PostgreSQL unique constraint შეცდომა
    if (err.code === '23505') {
        let field = 'ველი';
        if (err.constraint?.includes('email')) field = 'ელ-ფოსტა';
        if (err.constraint?.includes('username')) field = 'მომხმარებლის სახელი';
        if (err.constraint?.includes('slug')) field = 'slug';
        return res.status(409).json({
            error: `${field} უკვე გამოყენებულია. გთხოვთ აირჩიოთ სხვა.`
        });
    }

    // PostgreSQL foreign key შეცდომა
    if (err.code === '23503') {
        return res.status(400).json({
            error: 'შეუძლებელია წაშლა: ეს რესურსი გამოიყენება სხვა მონაცემებში (მაგ: სტუდენტის პროგრესი).'
        });
    }

    // JWT შეცდომა
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'არასწორი ტოკენი.' });
    }

    // Default შეცდომა
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'სერვერის შეცდომა. გთხოვთ სცადოთ მოგვიანებით.'
        : err.message || 'უცნობი შეცდომა';

    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
