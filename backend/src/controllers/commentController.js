// ============================================
// კომენტარების კონტროლერი (Q&A)
// ============================================

const { query } = require('../config/db');

// ლექციის კომენტარების მიღება
const getLessonComments = async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const result = await query(`
            SELECT c.*, u.username, u.avatar_url, u.role
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.lesson_id = $1 AND c.is_deleted = false
            ORDER BY c.is_pinned DESC, c.is_best_answer DESC, c.created_at DESC
        `, [lessonId]);

        // ხისებრი სტრუქტურის აწყობა (მარტივი ვერსია)
        const comments = result.rows;
        const commentMap = {};
        const rootComments = [];

        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment.id] = comment;
        });

        comments.forEach(comment => {
            if (comment.parent_id && commentMap[comment.parent_id]) {
                commentMap[comment.parent_id].replies.push(comment);
            } else {
                rootComments.push(comment);
            }
        });

        res.json(rootComments);
    } catch (error) {
        next(error);
    }
};

// კომენტარის დამატება
const addComment = async (req, res, next) => {
    try {
        const { lessonId, content, parentId } = req.body;
        const userId = req.user.id;

        const result = await query(`
            INSERT INTO comments (user_id, lesson_id, parent_id, content)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at
        `, [userId, lessonId, parentId || null, content]);

        res.status(201).json({
            message: 'კომენტარი წარმატებით დაემატა',
            commentId: result.rows[0].id
        });
    } catch (error) {
        next(error);
    }
};

// საუკეთესო პასუხად მონიშვნა
const markAsBestAnswer = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        // შევამოწმოთ, არის თუ არა მომხმარებელი ადმინი ან კურსის შემქმნელი
        // (ამისთვის ჯერ კომენტარიდან ლექცია და კურსი უნდა გავიგოთ)
        const commentInfo = await query(`
            SELECT c.id, c.lesson_id, cr.created_by
            FROM comments c
            JOIN lessons l ON c.lesson_id = l.id
            JOIN courses cr ON l.course_id = cr.id
            WHERE c.id = $1
        `, [commentId]);

        if (commentInfo.rows.length === 0) {
            return res.status(404).json({ error: 'კომენტარი ვერ მოიძებნა' });
        }

        const { lesson_id, created_by } = commentInfo.rows[0];

        if (req.user.role !== 'admin' && created_by !== userId) {
            return res.status(403).json({ error: 'ამ მოქმედების უფლება არ გაქვთ' });
        }

        // ჯერ მოვხსნათ სხვა საუკეთესო პასუხები ამ ლექციაზე
        await query('UPDATE comments SET is_best_answer = false WHERE lesson_id = $1', [lesson_id]);

        // მოვნიშნოთ ახალი
        await query('UPDATE comments SET is_best_answer = true WHERE id = $1', [commentId]);

        res.json({ message: 'საუკეთესო პასუხი მონიშნულია' });
    } catch (error) {
        next(error);
    }
};

// კომენტარის წაშლა (Soft delete)
const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await query('SELECT user_id FROM comments WHERE id = $1', [commentId]);

        if (comment.rows.length === 0) {
            return res.status(404).json({ error: 'კომენტარი ვერ მოიძებნა' });
        }

        if (comment.rows[0].user_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'წაშლის უფლება არ გაქვთ' });
        }

        await query('UPDATE comments SET is_deleted = true WHERE id = $1', [commentId]);
        res.json({ message: 'კომენტარი წაიშალა' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLessonComments,
    addComment,
    markAsBestAnswer,
    deleteComment
};
