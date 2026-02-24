// ============================================
// კურსების კონტროლერი
// ============================================

const { query } = require('../config/db');

// ყველა კურსის მიღება (ფილტრაციით)
// GET /api/courses
const getAllCourses = async (req, res, next) => {
    try {
        const { level, category, difficulty, search } = req.query;
        let sql = `SELECT c.*, 
                      (SELECT COUNT(*) FROM lessons WHERE course_id = c.id AND is_published = true) as lesson_count,
                      (SELECT COUNT(*) FROM course_enrollments WHERE course_id = c.id) as enrolled_count`;

        const params = [];
        const conditions = ['c.is_published = true'];

        if (level) {
            params.push(parseInt(level));
            conditions.push(`c.level = $${params.length}`);
        }
        if (category) {
            params.push(category);
            conditions.push(`c.category = $${params.length}`);
        }
        if (difficulty) {
            params.push(difficulty);
            conditions.push(`c.difficulty = $${params.length}`);
        }
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(c.title ILIKE $${params.length} OR c.description ILIKE $${params.length})`);
        }

        sql += ` FROM courses c WHERE ${conditions.join(' AND ')} ORDER BY c.level, c.sort_order`;

        const result = await query(sql, params);

        // Level-ებად დაჯგუფება
        const levels = {};
        result.rows.forEach(course => {
            if (!levels[course.level]) {
                levels[course.level] = [];
            }
            levels[course.level].push(course);
        });

        res.json({ courses: result.rows, levels, total: result.rowCount });
    } catch (error) {
        next(error);
    }
};

// ერთი კურსის მიღება slug-ით
// GET /api/courses/:slug
const getCourseBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const courseResult = await query(
            `SELECT c.*,
              (SELECT COUNT(*) FROM course_enrollments WHERE course_id = c.id) as enrolled_count
       FROM courses c WHERE c.slug = $1 AND c.is_published = true`,
            [slug]
        );

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'კურსი ვერ მოიძებნა.' });
        }

        const course = courseResult.rows[0];

        // კურსის ლექციები
        const lessonsResult = await query(
            `SELECT id, title, slug, content_type, xp_reward, sort_order, estimated_minutes, language
       FROM lessons WHERE course_id = $1 AND is_published = true ORDER BY sort_order`,
            [course.id]
        );

        // თუ მომხმარებელი ავტორიზებულია, პროგრესი და ჩარიცხვის სტატუსი
        let userProgress = [];
        let isEnrolled = false;
        if (req.user) {
            const progressResult = await query(
                `SELECT lesson_id, status, best_score, completed_at FROM user_progress WHERE user_id = $1 AND course_id = $2`,
                [req.user.id, course.id]
            );
            userProgress = progressResult.rows;

            const enrollmentResult = await query(
                `SELECT 1 FROM course_enrollments WHERE user_id = $1 AND course_id = $2`,
                [req.user.id, course.id]
            );
            isEnrolled = enrollmentResult.rowCount > 0;
        }

        res.json({
            course,
            lessons: lessonsResult.rows,
            userProgress,
            isEnrolled,
            totalLessons: lessonsResult.rowCount
        });
    } catch (error) {
        next(error);
    }
};

// კურსში ჩარიცხვა
// POST /api/courses/:id/enroll
const enrollCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        // კურსის არსებობის შემოწმება
        const courseResult = await query('SELECT id, title FROM courses WHERE id = $1', [id]);
        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'კურსი ვერ მოიძებნა.' });
        }

        // ჩარიცხვა
        await query(
            `INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT (user_id, course_id) DO NOTHING`,
            [req.user.id, id]
        );

        res.json({ message: `წარმატებით ჩაირიცხეთ კურსზე: ${courseResult.rows[0].title}` });
    } catch (error) {
        next(error);
    }
};

// კატეგორიების მიღება
// GET /api/courses/categories
const getCategories = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT category, COUNT(*) as course_count, MIN(level) as min_level, MAX(level) as max_level
       FROM courses WHERE is_published = true GROUP BY category ORDER BY min_level`
        );
        res.json({ categories: result.rows });
    } catch (error) {
        next(error);
    }
};

// კურსიდან ამოწერა (Unenroll)
// DELETE /api/courses/:id/unenroll
const unenrollCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        // წაშლა ჩარიცხვებიდან
        const result = await query(
            'DELETE FROM course_enrollments WHERE user_id = $1 AND course_id = $2 RETURNING *',
            [req.user.id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ჩარიცხვა ვერ მოიძებნა.' });
        }

        // ასევე წავშალოთ ამ კურსის პროგრესი
        await query(
            'DELETE FROM user_progress WHERE user_id = $1 AND course_id = $2',
            [req.user.id, id]
        );

        res.json({ message: 'წარმატებით ამოეწერეთ კურსიდან.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCourses, getCourseBySlug, enrollCourse, unenrollCourse, getCategories };
