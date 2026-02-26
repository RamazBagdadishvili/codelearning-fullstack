// ============================================
// ადმინ კონტროლერი
// ============================================

const { pool, query } = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini AI Setup
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// დეშბორდის სტატისტიკა
// GET /api/admin/stats
const getStats = async (req, res, next) => {
    try {
        const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_week,
        (SELECT COUNT(*) FROM courses) as total_courses,
        (SELECT COUNT(*) FROM lessons) as total_lessons,
        (SELECT COUNT(*) FROM code_submissions) as total_submissions,
        (SELECT COUNT(*) FROM code_submissions WHERE passed = true) as passed_submissions,
        (SELECT COUNT(*) FROM course_enrollments) as total_enrollments,
        (SELECT COUNT(*) FROM user_progress WHERE status = 'completed') as completed_lessons
    `);
        res.json({ stats: stats.rows[0] });
    } catch (error) {
        next(error);
    }
};

// კურსის შექმნა
// POST /api/admin/courses
const createCourse = async (req, res, next) => {
    try {
        const { title, slug, description, shortDescription, category, difficulty, level, icon, color, estimatedHours } = req.body;

        const result = await query(
            `INSERT INTO courses (title, slug, description, short_description, category, difficulty, level, icon, color, estimated_hours, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
            [title, slug, description, shortDescription, category, difficulty, level, icon, color, estimatedHours, req.user.id]
        );

        res.status(201).json({ course: result.rows[0], message: 'კურსი წარმატებით შეიქმნა.' });
    } catch (error) {
        next(error);
    }
};

// კურსის განახლება
// PUT /api/admin/courses/:id
const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, shortDescription, category, difficulty, level, icon, color, estimatedHours, isPublished } = req.body;

        const result = await query(
            `UPDATE courses SET title = COALESCE($1, title), description = COALESCE($2, description),
       short_description = COALESCE($3, short_description), category = COALESCE($4, category),
       difficulty = COALESCE($5, difficulty), level = COALESCE($6, level), icon = COALESCE($7, icon),
       color = COALESCE($8, color), estimated_hours = COALESCE($9, estimated_hours),
       is_published = COALESCE($10, is_published)
       WHERE id = $11 RETURNING *`,
            [title, description, shortDescription, category, difficulty, level, icon, color, estimatedHours, isPublished, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'კურსი ვერ მოიძებნა.' });
        res.json({ course: result.rows[0], message: 'კურსი წარმატებით განახლდა.' });
    } catch (error) {
        next(error);
    }
};

// ლექციის შექმნა
// POST /api/admin/lessons
const createLesson = async (req, res, next) => {
    try {
        const { courseId, title, slug, content, contentType, starterCode, solutionCode, challengeText, testCases, hints, language, xpReward, sortOrder } = req.body;

        // Explicitly stringify if it's an object/array to ensure valid JSON string for PG
        const finalTestCases = (testCases && typeof testCases === 'object') ? JSON.stringify(testCases) : (testCases || '[]');
        const finalHints = (hints && typeof hints === 'object') ? JSON.stringify(hints) : (hints || '[]');

        const result = await query(
            `INSERT INTO lessons (course_id, title, slug, content, content_type, starter_code, solution_code, challenge_text, test_cases, hints, language, xp_reward, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
            [courseId, title, slug, content, contentType || 'theory', starterCode, solutionCode, challengeText, finalTestCases, finalHints, language || 'html', xpReward || 10, sortOrder || 0]
        );

        // total_lessons განახლება
        await query('UPDATE courses SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1) WHERE id = $1', [courseId]);

        res.status(201).json({ lesson: result.rows[0], message: 'ლექცია წარმატებით შეიქმნა.' });
    } catch (error) {
        next(error);
    }
};

// ლექციის განახლება
// PUT /api/admin/lessons/:id
const updateLesson = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, slug, content, contentType, starterCode, solutionCode, challengeText, testCases, hints, language, xpReward, sortOrder, isPublished } = req.body;

        // Explicitly stringify if it's an object/array to ensure valid JSON string for PG
        const finalTestCases = testCases !== undefined ? (typeof testCases === 'object' ? JSON.stringify(testCases) : testCases) : undefined;
        const finalHints = hints !== undefined ? (typeof hints === 'object' ? JSON.stringify(hints) : hints) : undefined;

        const result = await query(
            `UPDATE lessons SET 
               title = COALESCE($1, title), 
               slug = COALESCE($2, slug),
               content = COALESCE($3, content),
               content_type = COALESCE($4, content_type), 
               starter_code = COALESCE($5, starter_code),
               solution_code = COALESCE($6, solution_code), 
               challenge_text = COALESCE($7, challenge_text),
               test_cases = COALESCE($8, test_cases),
               hints = COALESCE($9, hints), 
               language = COALESCE($10, language), 
               xp_reward = COALESCE($11, xp_reward),
               sort_order = COALESCE($12, sort_order),
               is_published = COALESCE($13, is_published)
              WHERE id = $14 RETURNING *`,
            [title, slug, content, contentType, starterCode, solutionCode, challengeText, finalTestCases, finalHints, language, xpReward, sortOrder, isPublished, id]
        );


        if (result.rows.length === 0) return res.status(404).json({ error: 'ლექცია ვერ მოიძებნა.' });
        res.json({ lesson: result.rows[0], message: 'ლექცია წარმატებით განახლდა.' });
    } catch (error) {
        next(error);
    }
};

// კურსის წაშლა
// DELETE /api/admin/courses/:id
const deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Delete related records to bypass missing cascade constraints
        await query('DELETE FROM comments WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id = $1)', [id]);
        await query('DELETE FROM code_submissions WHERE lesson_id IN (SELECT id FROM lessons WHERE course_id = $1)', [id]);
        await query('DELETE FROM user_progress WHERE course_id = $1', [id]);
        await query('DELETE FROM course_enrollments WHERE course_id = $1', [id]);
        await query('DELETE FROM quiz_attempts WHERE quiz_id IN (SELECT id FROM quizzes WHERE course_id = $1)', [id]);
        await query('DELETE FROM quiz_questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE course_id = $1)', [id]);
        await query('DELETE FROM quizzes WHERE course_id = $1', [id]);
        await query('DELETE FROM lessons WHERE course_id = $1', [id]);

        // 2. Delete the course
        const result = await query('DELETE FROM courses WHERE id = $1 RETURNING id, title', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'კურსი ვერ მოიძებნა.' });
        res.json({ message: `კურსი "${result.rows[0].title}" წარმატებით წაიშალა.` });
    } catch (error) {
        next(error);
    }
};

// ლექციის წაშლა
// DELETE /api/admin/lessons/:id
const deleteLesson = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Get courseId for updating total_lessons later
        const lessonCheck = await query('SELECT course_id FROM lessons WHERE id = $1', [id]);
        if (lessonCheck.rows.length === 0) return res.status(404).json({ error: 'ლექცია ვერ მოიძებნა.' });
        const courseId = lessonCheck.rows[0].course_id;

        // 2. Delete related records to bypass missing cascade constraints
        await query('DELETE FROM comments WHERE lesson_id = $1', [id]);
        await query('DELETE FROM code_submissions WHERE lesson_id = $1', [id]);
        await query('DELETE FROM user_progress WHERE lesson_id = $1', [id]);
        await query('DELETE FROM quiz_attempts WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id = $1)', [id]);
        await query('DELETE FROM quiz_questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE lesson_id = $1)', [id]);
        await query('DELETE FROM quizzes WHERE lesson_id = $1', [id]);

        // 3. Delete the lesson
        const result = await query('DELETE FROM lessons WHERE id = $1 RETURNING id, course_id, title', [id]);

        // 4. Update total_lessons
        await query('UPDATE courses SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1) WHERE id = $1', [courseId]);

        res.json({ message: `ლექცია "${result.rows[0].title}" წარმატებით წაიშალა.` });
    } catch (error) {
        next(error);
    }
};

// შემოწმების ტესტების გენერირება (AI Logic)
// POST /api/admin/lessons/generate-tests
const generateTestCases = async (req, res, next) => {
    try {
        const { challengeText, language } = req.body;
        if (!challengeText) return res.status(400).json({ error: 'დავალების ტექსტი აუცილებელია.' });

        // შევეცადოთ გამოვიყენოთ Gemini
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
                const prompt = `
            შენ ხარ პროგრამირების მასწავლებელი. მომეცი ტესტების სია (JSON ფორმატში) შემდეგი დავალებისთვის. 
            დავალება: "${challengeText}"
            ენა: ${language}
            
            წესები ტესტებისთვის:
            1. გამოიყენე 'expect' სინტაქსი.
            2. HTML/CSS დავალებებისას გამოიყენე 'document.querySelector' და 'computedStyle'.
            3. ტესტის კოდი უნდა იყოს მაქსიმალურად მოკლე და ეფექტური.
            4. დააბრუნე მხოლოდ სუფთა JSON მასივი ობიექტებით, მარკდაუნის (backticks) გარეშე: [{"testName": "აღწერა ქართულად", "testCode": "javascript expect code"}].
            
            მაგალითი HTML-ისთვის:
            [{"testName": "უნდა იყოს h1 ტეგი", "testCode": "expect(document.querySelector('h1')).toBeTruthy();"}]
        `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // ამოვიღოთ JSON ტექსტიდან
                const jsonMatch = text.match(/\[.*\]/s);
                if (jsonMatch) {
                    const testCases = JSON.parse(jsonMatch[0]);
                    return res.json({ testCases });
                }
            } catch (aiError) {
                console.error('Gemini AI Error:', aiError);
                // Fallback to regex if AI fails
            }
        }

        // Fallback: ძველი Regex Logics
        const tests = [];
        const text = challengeText.toLowerCase();

        if (language === 'html' || language === 'jsx' || !language) {
            const tags = [
                { key: 'h1', name: 'h1 სათაური' }, { key: 'p', name: 'პარაგრაფი (p)' },
                { key: 'button', name: 'ღილაკი (button)' }, { key: 'img', name: 'სურათი (img)' },
                { key: 'input', name: 'ინპუტი (input)' }, { key: 'ul', name: 'სია (ul)' },
                { key: 'li', name: 'სიის ელემენტი (li)' }, { key: 'div', name: 'კონტეინერი (div)' }
            ];

            tags.forEach(t => {
                if (text.includes(t.key)) {
                    tests.push({
                        testName: `${t.name} არსებობს`,
                        testCode: `expect(document.querySelector('${t.key}')).toBeTruthy();`
                    });
                }
            });

            const quotedMatches = challengeText.match(/\"([^\"]+)\"/g);
            if (quotedMatches) {
                quotedMatches.forEach(m => {
                    const val = m.replace(/\"/g, '');
                    tests.push({
                        testName: `ტექსტი "${val}" მოიძებნა`,
                        testCode: `expect(document.body.innerText).toContain('${val}');`
                    });
                });
            }
        }

        if (language === 'css' && text.includes('color')) {
            tests.push({
                testName: 'სტილი შეცვლილია',
                testCode: "const el = document.body.firstElementChild; expect(getComputedStyle(el).color).not.toBe('rgb(0, 0, 0)');"
            });
        }

        res.json({ testCases: tests });
    } catch (error) {
        next(error);
    }
};

// სრული ლექციის გენერირება (AI)
// POST /api/admin/lessons/generate-full
const generateFullLesson = async (req, res, next) => {
    try {
        const { topic, courseTitle, language } = req.body;
        if (!topic) return res.status(400).json({ error: 'თემა აუცილებელია.' });

        if (!genAI) return res.status(503).json({ error: 'AI სერვისი მიუწვდომელია.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
            შენ ხარ პროგრამირების პროფესიონალი მასწავლებელი. შექმენი სრულყოფილი სასწავლო ლექცია თემაზე: "${topic}".
            კურსი: "${courseTitle || 'პროგრამირება'}"
            ენა: "${language || 'html'}"

            დააბრუნე პასუხი მხოლოდ სუფთა JSON ფორმატში, მარკდაუნის (backticks) გარეშე, შემდეგი სტრუქტურით:
            {
              "title": "ლექციის სათაური ქართულად",
              "content": "ვრცელი თეორიული მასალა Markdown ფორმატში, მოიცავი მაგალითები და განმარტებები",
              "challengeText": "პრაქტიკული დავალების აღწერა ქართულად",
              "starterCode": "საწყისი კოდი სტუდენტისთვის",
              "solutionCode": "სწორი კოდი (ამოსახსნელი)",
              "testCases": [{"testName": "ტესტის დასახელება", "testCode": "expect(...) სინტაქსი"}],
              "xpReward": 15
            }
            ყველა ტექსტი უნდა იყოს გამართულ ქართულ ენაზე.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{.*\}/s);

        if (jsonMatch) {
            const lessonData = JSON.parse(jsonMatch[0]);
            res.json(lessonData);
        } else {
            throw new Error('AI-მ ვერ დააგენერირა ვალიდური JSON პასუხი.');
        }
    } catch (error) {
        next(error);
    }
};

// მხოლოდ თეორიული მასალის გენერირება (AI)
// POST /api/admin/lessons/generate-content
const generateLessonContent = async (req, res, next) => {
    try {
        const { title, courseTitle } = req.body;
        if (!title) return res.status(400).json({ error: 'სათაური აუცილებელია.' });

        if (!genAI) {
            console.error('AI Error: GEMINI_API_KEY is missing in environment variables.');
            return res.status(503).json({ error: 'AI სერვისი მიუწვდომელია. გთხოვთ შეამოწმოთ GEMINI_API_KEY .env ფაილში.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
            დაწერე სასწავლო თეორიული მასალა Markdown ფორმატში ლექციისთვის: "${title}".
            კურსი: "${courseTitle || ''}"
            ტექსტი უნდა იყოს ქართულ ენაზე, იყოს მარტივად გასაგები და მოიცავდეს კოდის მაგალითებს.
            დააბრუნე მხოლოდ Markdown ტექსტი.
        `;

        const result = await model.generateContent(prompt);
        if (!result.response) throw new Error('AI-მ არ დააბრუნა პასუხი (Empty Response).');

        const responseText = result.response.text();
        res.json({ content: responseText });
    } catch (error) {
        console.error('Gemini API Connection Error:', error);
        // თუ სპეციფიკური შეცდომაა Google-ის მხრიდან
        if (error.message?.includes('API_KEY_INVALID')) {
            return res.status(401).json({ error: 'არასწორი API Key. გადაამოწმეთ .env ფაილი.' });
        }
        if (error.message?.includes('quota')) {
            return res.status(429).json({ error: 'ლიმიტი ამოიწურა ან საჭიროა ბალანსის შევსება (10$).' });
        }
        res.status(500).json({ error: 'AI სერვერთან კავშირი ვერ დამყარდა: ' + error.message });
    }
};

// დავალების და კოდის გენერირება თეორიიდან გამომდინარე (AI)
// POST /api/admin/lessons/generate-challenge
const generateCodeChallenge = async (req, res, next) => {
    try {
        const { content, language } = req.body;
        if (!content) return res.status(400).json({ error: 'მასალა აუცილებელია.' });

        if (!genAI) return res.status(503).json({ error: 'AI სერვისი მიუწვდომელია.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
            ამ თეორიული მასალიდან გამომდინარე:
            "${content}"
            
            შექმენი შესაბამისი პრაქტიკული დავალება. ენა: ${language || 'javascript'}.
            დააბრუნე მხოლოდ სუფთა JSON, მარკდაუნის (backticks) გარეშე:
            {
              "challengeText": "დავალების აღწერა ქართულად",
              "starterCode": "საწყისი კოდი",
              "solutionCode": "სწორი კოდი",
              "testCases": [{"testName": "აღწერა", "testCode": "expect(...)"}]
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{.*\}/s);

        if (jsonMatch) {
            res.json(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error('AI-მ ვერ დააგენერირა ვალიდური JSON პასუხი.');
        }
    } catch (error) {
        next(error);
    }
};

// ყველა კურსი ლექციებით (ადმინისთვის)
// GET /api/admin/courses
const getCourses = async (req, res, next) => {
    try {
        const coursesResult = await query('SELECT * FROM courses ORDER BY sort_order ASC, created_at DESC');
        // მხოლოდ საჭირო ველები სიისთვის (ოპტიმიზაცია)
        const lessonsResult = await query('SELECT id, course_id, title, slug, content_type, is_published, sort_order, xp_reward FROM lessons ORDER BY sort_order ASC');

        const courses = coursesResult.rows.map(course => {
            return {
                ...course,
                lessons: lessonsResult.rows.filter(l => l.course_id === course.id)
            };
        });

        res.json({ courses });
    } catch (error) {
        next(error);
    }
};

// ლექციის დუბლირება (Clone)
// POST /api/admin/lessons/:id/clone
const cloneLesson = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. გამოვიძახოთ ორიგინალი ლექცია
        const originalLesson = await query('SELECT * FROM lessons WHERE id = $1', [id]);
        if (originalLesson.rows.length === 0) return res.status(404).json({ error: 'ლექცია ვერ მოიძებნა.' });

        const lesson = originalLesson.rows[0];

        // 2. მოვამზადოთ ახალი მონაცემები
        const newTitle = `${lesson.title} (Copy)`;
        const newSlug = `${lesson.slug}-copy-${Date.now().toString().slice(-4)}`;
        const newSortOrder = (lesson.sort_order || 0) + 1;

        const finalTestCases = (lesson.test_cases && typeof lesson.test_cases === 'object') ? JSON.stringify(lesson.test_cases) : (lesson.test_cases || '[]');
        const finalHints = (lesson.hints && typeof lesson.hints === 'object') ? JSON.stringify(lesson.hints) : (lesson.hints || '[]');

        // 3. ჩავწეროთ ახალი ლექცია
        const result = await query(
            `INSERT INTO lessons (
                course_id, title, slug, content, content_type, starter_code, 
                solution_code, challenge_text, test_cases, hints, language, 
                xp_reward, sort_order, is_published
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [
                lesson.course_id, newTitle, newSlug, lesson.content, lesson.content_type,
                lesson.starter_code, lesson.solution_code, lesson.challenge_text,
                finalTestCases, finalHints, lesson.language,
                lesson.xp_reward, newSortOrder, false // დუბლიკატი იყოს დამალული თავიდან
            ]
        );

        res.json({ lesson: result.rows[0], message: 'ლექცია წარმატებით დაკოპირდა.' });
    } catch (error) {
        next(error);
    }
};

// კურსის დუბლირება (Clone)
// POST /api/admin/courses/:id/clone
const cloneCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. გამოვიძახოთ ორიგინალი კურსი
        const originalCourse = await query('SELECT * FROM courses WHERE id = $1', [id]);
        if (originalCourse.rows.length === 0) return res.status(404).json({ error: 'კურსი ვერ მოიძებნა.' });

        const course = originalCourse.rows[0];

        // 2. მოვამზადოთ ახალი მონაცემები
        const newTitle = `${course.title} (კოპია)`;
        const newSlug = `${course.slug}-copy-${Date.now().toString().slice(-4)}`;

        // 3. ჩავწეროთ ახალი კურსი
        const courseResult = await query(
            `INSERT INTO courses (
                title, slug, description, short_description, category, 
                difficulty, level, icon, color, estimated_hours, created_by, is_published
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false) RETURNING *`,
            [
                newTitle, newSlug, course.description, course.short_description, course.category,
                course.difficulty, course.level, course.icon, course.color, course.estimated_hours, req.user.id
            ]
        );

        const newCourseId = courseResult.rows[0].id;

        // 4. დავაკოპიროთ ყველა ლექცია
        const lessons = await query('SELECT * FROM lessons WHERE course_id = $1 ORDER BY sort_order ASC', [id]);

        for (const lesson of lessons.rows) {
            await query(
                `INSERT INTO lessons (
                    course_id, title, slug, content, content_type, starter_code, 
                    solution_code, challenge_text, test_cases, hints, language, 
                    xp_reward, sort_order, is_published
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, false)`,
                [
                    newCourseId, lesson.title, `${lesson.slug}-copy-${Math.random().toString(36).substring(7)}`,
                    lesson.content, lesson.content_type, lesson.starter_code,
                    lesson.solution_code, lesson.challenge_text, lesson.test_cases,
                    lesson.hints, lesson.language, lesson.xp_reward, lesson.sort_order
                ]
            );
        }

        res.json({ course: courseResult.rows[0], message: 'კურსი და მისი ლექციები წარმატებით დაკოპირდა.' });
    } catch (error) {
        next(error);
    }
};

// ყველა მომხმარებელი (ადმინისთვის)
// GET /api/admin/users
const getUsers = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, email, username, full_name, role, xp_points, level, streak_days, is_active, created_at
       FROM users ORDER BY created_at DESC`
        );
        res.json({ users: result.rows });
    } catch (error) {
        next(error);
    }
};

// მომხმარებლის როლის შეცვლა
// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['student', 'admin', 'instructor'].includes(role)) {
            return res.status(400).json({ error: 'არასწორი როლი. დასაშვებია: student, admin, instructor.' });
        }

        // ადმინს საკუთარი თავის როლის შეცვლა არ შეუძლია
        if (id === req.user.id) {
            return res.status(403).json({ error: 'საკუთარი როლის შეცვლა არ შეგიძლიათ.' });
        }

        const result = await query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
            [role, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა.' });
        res.json({ user: result.rows[0], message: `როლი წარმატებით შეიცვალა: ${role}` });
    } catch (error) {
        next(error);
    }
};

// მომხმარებლის ბლოკირება / განბლოკვა
// PUT /api/admin/users/:id/toggle-active
const toggleUserActive = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id === req.user.id) {
            return res.status(403).json({ error: 'საკუთარი თავის დაბლოკვა არ შეგიძლიათ.' });
        }

        const result = await query(
            'UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, username, is_active',
            [id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა.' });
        const user = result.rows[0];
        res.json({ user, message: user.is_active ? `${user.username} განბლოკილია.` : `${user.username} დაბლოკილია.` });
    } catch (error) {
        next(error);
    }
};

// მომხმარებლის წაშლა (Hard Delete)
// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id === req.user.id) {
            return res.status(403).json({ error: 'საკუთარი ანგარიშის წაშლა არ შეგიძლიათ.' });
        }

        // 1. Delete related records to bypass missing cascade constraints
        await query('DELETE FROM comments WHERE user_id = $1', [id]);
        await query('DELETE FROM quiz_attempts WHERE user_id = $1', [id]);
        await query('DELETE FROM notifications WHERE user_id = $1', [id]);
        await query('DELETE FROM user_achievements WHERE user_id = $1', [id]);
        await query('DELETE FROM course_enrollments WHERE user_id = $1', [id]);
        await query('DELETE FROM user_progress WHERE user_id = $1', [id]);
        await query('DELETE FROM code_submissions WHERE user_id = $1', [id]);
        await query('UPDATE courses SET created_by = NULL WHERE created_by = $1', [id]);

        // 2. finally, Delete the user
        const result = await query(
            'DELETE FROM users WHERE id = $1 RETURNING id, username',
            [id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა.' });
        res.json({ message: `მომხმარებელი "${result.rows[0].username}" სრულად წაიშალა სისტემიდან.` });
    } catch (error) {
        next(error);
    }
};

// მომხმარებლის Level-ის შეცვლა
// PUT /api/admin/users/:id/level
const updateUserLevel = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { level } = req.body;

        if (!level || level < 1 || level > 200) {
            return res.status(400).json({ error: 'Level უნდა იყოს 1-დან 200-მდე.' });
        }

        const result = await query(
            'UPDATE users SET level = $1 WHERE id = $2 RETURNING id, username, level',
            [level, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა.' });
        res.json({ user: result.rows[0], message: `Level შეიცვალა: ${level}` });
    } catch (error) {
        next(error);
    }
};

// მომხმარებლის XP-ის შეცვლა
// PUT /api/admin/users/:id/xp
const updateUserXp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { xp } = req.body;

        if (xp === undefined || xp < 0) {
            return res.status(400).json({ error: 'XP უნდა იყოს 0 ან მეტი.' });
        }

        const result = await query(
            'UPDATE users SET xp_points = $1 WHERE id = $2 RETURNING id, username, xp_points',
            [xp, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა.' });
        res.json({ user: result.rows[0], message: `XP შეიცვალა: ${xp}` });
    } catch (error) {
        next(error);
    }
};

// ========================================
// ანალიტიკა (Analytics / Charts Data)
// ========================================
// GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
    try {
        // ბოლო 30 დღის რეგისტრაციები (დღეების მიხედვით)
        const dailyRegistrations = await query(`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM users
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // ბოლო 30 დღის სუბმიშენები
        const dailySubmissions = await query(`
            SELECT DATE(created_at) as date, 
                   COUNT(*) as total,
                   COUNT(*) FILTER (WHERE passed = true) as passed
            FROM code_submissions
            WHERE created_at > NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // კურსების პოპულარობა (ჩარიცხვების მიხედვით)
        const coursePopularity = await query(`
            SELECT c.title, c.icon, c.color, COUNT(ce.id) as enrollments
            FROM courses c
            LEFT JOIN course_enrollments ce ON c.id = ce.course_id
            GROUP BY c.id, c.title, c.icon, c.color
            ORDER BY enrollments DESC
            LIMIT 10
        `);

        // ლექციების დასრულების რეიტინგი (ტოპ "რთული" ლექციები)
        const hardestLessons = await query(`
            SELECT l.title, c.title as course_title,
                   COUNT(up.id) as attempts,
                   COUNT(up.id) FILTER (WHERE up.status = 'completed') as completions
            FROM lessons l
            JOIN courses c ON l.course_id = c.id
            LEFT JOIN user_progress up ON l.id = up.lesson_id
            GROUP BY l.id, l.title, c.title
            HAVING COUNT(up.id) > 0
            ORDER BY (COUNT(up.id) FILTER (WHERE up.status = 'completed'))::float / NULLIF(COUNT(up.id), 0) ASC
            LIMIT 10
        `);

        // როლების განაწილება
        const roleDistribution = await query(`
            SELECT role, COUNT(*) as count FROM users GROUP BY role
        `);

        res.json({
            dailyRegistrations: dailyRegistrations.rows,
            dailySubmissions: dailySubmissions.rows,
            coursePopularity: coursePopularity.rows,
            hardestLessons: hardestLessons.rows,
            roleDistribution: roleDistribution.rows
        });
    } catch (error) {
        next(error);
    }
};

// ========================================
// შეტყობინებები (Notifications)
// ========================================
// POST /api/admin/notifications/broadcast
const broadcastNotification = async (req, res, next) => {
    try {
        const { title, message, type } = req.body;
        if (!title || !message) {
            return res.status(400).json({ error: 'სათაური და შეტყობინება სავალდებულოა.' });
        }

        const activeUsers = await query('SELECT id FROM users WHERE is_active = true');
        const notifType = type || 'announcement';

        for (const user of activeUsers.rows) {
            await query(
                'INSERT INTO notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)',
                [user.id, notifType, title, message]
            );
        }

        res.json({ message: `შეტყობინება გაიგზავნა ${activeUsers.rows.length} მომხმარებელთან.`, count: activeUsers.rows.length });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/notifications/send
const sendNotification = async (req, res, next) => {
    try {
        const { userId, title, message, type } = req.body;
        if (!userId || !title || !message) {
            return res.status(400).json({ error: 'მომხმარებლის ID, სათაური და შეტყობინება სავალდებულოა.' });
        }

        await query(
            'INSERT INTO notifications (user_id, type, title, message) VALUES ($1, $2, $3, $4)',
            [userId, type || 'admin_message', title, message]
        );

        res.json({ message: 'შეტყობინება წარმატებით გაიგზავნა.' });
    } catch (error) {
        next(error);
    }
};

// ========================================
// მიღწევები (Achievements CRUD)
// ========================================
// GET /api/admin/achievements
const getAchievements = async (req, res, next) => {
    try {
        const result = await query(`
            SELECT a.*, 
                   (SELECT COUNT(*) FROM user_achievements ua WHERE ua.achievement_id = a.id) as earned_count
            FROM achievements a 
            ORDER BY a.sort_order ASC, a.created_at DESC
        `);
        res.json({ achievements: result.rows });
    } catch (error) {
        next(error);
    }
};

// POST /api/admin/achievements
const createAchievement = async (req, res, next) => {
    try {
        const { title, description, badgeIcon, badgeColor, criteriaType, criteriaValue, xpReward, category, sortOrder } = req.body;
        if (!title || !badgeIcon || !criteriaType || !criteriaValue) {
            return res.status(400).json({ error: 'სათაური, აიქონი, კრიტერიუმის ტიპი და მნიშვნელობა სავალდებულოა.' });
        }

        const result = await query(
            `INSERT INTO achievements (title, description, badge_icon, badge_color, criteria_type, criteria_value, xp_reward, category, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [title, description || '', badgeIcon, badgeColor || '#FFD700', criteriaType, criteriaValue, xpReward || 50, category || 'general', sortOrder || 0]
        );

        res.json({ achievement: result.rows[0], message: 'მიღწევა წარმატებით შეიქმნა!' });
    } catch (error) {
        next(error);
    }
};

// PUT /api/admin/achievements/:id
const updateAchievement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, badgeIcon, badgeColor, criteriaType, criteriaValue, xpReward, category, sortOrder } = req.body;

        const result = await query(
            `UPDATE achievements SET title=$1, description=$2, badge_icon=$3, badge_color=$4, 
             criteria_type=$5, criteria_value=$6, xp_reward=$7, category=$8, sort_order=$9
             WHERE id=$10 RETURNING *`,
            [title, description, badgeIcon, badgeColor, criteriaType, criteriaValue, xpReward, category, sortOrder, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'მიღწევა ვერ მოიძებნა.' });
        res.json({ achievement: result.rows[0], message: 'მიღწევა განახლდა!' });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/admin/achievements/:id
const deleteAchievement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query('DELETE FROM achievements WHERE id = $1 RETURNING title', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'მიღწევა ვერ მოიძებნა.' });
        res.json({ message: `მიღწევა "${result.rows[0].title}" წაიშალა.` });
    } catch (error) {
        next(error);
    }
};

// ========================================
// კოდის სუბმიშენები (Submissions Review)
// ========================================
// GET /api/admin/submissions
const getSubmissions = async (req, res, next) => {
    try {
        const { status, limit } = req.query;
        let sqlQuery = `
            SELECT cs.*, u.username, u.email, l.title as lesson_title, c.title as course_title
            FROM code_submissions cs
            JOIN users u ON cs.user_id = u.id
            JOIN lessons l ON cs.lesson_id = l.id
            JOIN courses c ON l.course_id = c.id
        `;
        const params = [];

        if (status === 'passed') { sqlQuery += ' WHERE cs.passed = true'; }
        else if (status === 'failed') { sqlQuery += ' WHERE cs.passed = false'; }

        sqlQuery += ' ORDER BY cs.created_at DESC LIMIT $' + (params.length + 1);
        params.push(parseInt(limit) || 50);

        const result = await query(sqlQuery, params);
        res.json({ submissions: result.rows });
    } catch (error) {
        next(error);
    }
};

// ========================================
// ლექციების გადალაგება (Reorder)
// ========================================
// PUT /api/admin/lessons/reorder
const reorderLessons = async (req, res, next) => {
    try {
        const { lessonOrders } = req.body; // [{id, sortOrder}]
        if (!lessonOrders || !Array.isArray(lessonOrders)) {
            return res.status(400).json({ error: 'lessonOrders მასივი სავალდებულოა.' });
        }

        for (const item of lessonOrders) {
            await query('UPDATE lessons SET sort_order = $1 WHERE id = $2', [item.sortOrder, item.id]);
        }

        res.json({ message: `${lessonOrders.length} ლექციის რიგითობა განახლდა.` });
    } catch (error) {
        next(error);
    }
};

// ========================================
// სუბმიშენების გასუფთავება
// ========================================
const clearAllSubmissions = async (req, res, next) => {
    try {
        // წავშალოთ მხოლოდ ისტორიული მონაცემები (სუბმიშენები და ქვიზის მცდელობები)
        await query('DELETE FROM code_submissions');
        await query('DELETE FROM quiz_attempts');

        res.json({ message: 'სუბმიშენების ისტორია წარმატებით გასუფთავდა.' });
    } catch (error) {
        next(error);
    }
};

// ========================================
// მომხმარებლის კურსების მართვა
// ========================================
const getUserEnrollments = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query(
            `SELECT ce.*, c.title, c.icon, c.color, c.category, c.level
             FROM course_enrollments ce
             JOIN courses c ON ce.course_id = c.id
             WHERE ce.user_id = $1
             ORDER BY ce.enrolled_at DESC`,
            [id]
        );
        res.json({ enrollments: result.rows });
    } catch (error) {
        next(error);
    }
};

const enrollUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ error: 'კურსის ID სავალდებულოა.' });
        }

        await query(
            'INSERT INTO course_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, courseId]
        );

        res.json({ message: 'მომხმარებელი წარმატებით ჩაირიცხა კურსზე.' });
    } catch (error) {
        next(error);
    }
};

const unenrollUser = async (req, res, next) => {
    try {
        const { id, courseId } = req.params;

        // წაშლა ჩარიცხვებიდან
        const result = await query(
            'DELETE FROM course_enrollments WHERE user_id = $1 AND course_id = $2 RETURNING *',
            [id, courseId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'ჩანაწერი ვერ მოიძებნა.' });
        }

        // ასევე წავშალოთ პროგრესი ამ კურსისთვის
        await query(
            'DELETE FROM user_progress WHERE user_id = $1 AND course_id = $2',
            [id, courseId]
        );

        res.json({ message: 'მომხმარებელი წარმატებით ამოიშალა კურსიდან.' });
    } catch (error) {
        next(error);
    }
};

// ლექციის ამოღება ID-ით (რედაქტირებისთვის)
// GET /api/admin/lessons/:id
const getLessonById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query(
            'SELECT * FROM lessons WHERE id = $1',
            [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'ლექცია ვერ მოიძებნა.' });
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStats, createCourse, updateCourse, deleteCourse, createLesson, updateLesson, deleteLesson,
    getUsers, getCourses, updateUserRole, toggleUserActive, deleteUser, updateUserLevel, updateUserXp,
    getAnalytics, broadcastNotification, sendNotification,
    getAchievements, createAchievement, updateAchievement, deleteAchievement,
    getSubmissions, clearAllSubmissions, reorderLessons,
    getUserEnrollments, enrollUser, unenrollUser, getLessonById,
    generateTestCases, generateFullLesson, generateLessonContent, generateCodeChallenge, cloneLesson, cloneCourse
};
