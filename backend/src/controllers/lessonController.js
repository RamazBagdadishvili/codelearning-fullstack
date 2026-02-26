// ============================================
// ლექციების კონტროლერი
// ============================================

const { query } = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini AI Setup
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// ლექციის მიღება
// GET /api/lessons/:courseSlug/:lessonSlug
const getLesson = async (req, res, next) => {
    try {
        const { courseSlug, lessonSlug } = req.params;

        // კურსის მოძიება
        const courseResult = await query('SELECT id, title, slug FROM courses WHERE slug = $1', [courseSlug]);
        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'კურსი ვერ მოიძებნა.' });
        }

        const courseId = courseResult.rows[0].id;

        // ლექციის მოძიება
        const lessonResult = await query(
            `SELECT * FROM lessons WHERE course_id = $1 AND slug = $2 AND is_published = true`,
            [courseId, lessonSlug]
        );

        if (lessonResult.rows.length === 0) {
            return res.status(404).json({ error: 'ლექცია ვერ მოიძებნა.' });
        }

        const lesson = lessonResult.rows[0];

        // წინა/შემდეგი ლექცია
        const navResult = await query(
            `SELECT id, title, slug, sort_order FROM lessons 
       WHERE course_id = $1 AND is_published = true AND (sort_order = $2 - 1 OR sort_order = $2 + 1)
       ORDER BY sort_order`,
            [courseId, lesson.sort_order]
        );

        const prevLesson = navResult.rows.find(l => l.sort_order < lesson.sort_order);
        const nextLesson = navResult.rows.find(l => l.sort_order > lesson.sort_order);

        // პროგრესი (თუ ავტორიზებულია)
        let progress = null;
        if (req.user) {
            const progressResult = await query(
                'SELECT * FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
                [req.user.id, lesson.id]
            );
            progress = progressResult.rows[0] || null;
        }

        res.json({
            lesson,
            course: courseResult.rows[0],
            navigation: { prev: prevLesson || null, next: nextLesson || null },
            progress
        });
    } catch (error) {
        next(error);
    }
};

// კოდის გაგზავნა და შემოწმება
// POST /api/lessons/:lessonId/submit
const submitCode = async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const { code } = req.body;

        // ლექციის მოძიება
        const lessonResult = await query('SELECT * FROM lessons WHERE id = $1', [lessonId]);
        if (lessonResult.rows.length === 0) {
            return res.status(404).json({ error: 'ლექცია ვერ მოიძებნა.' });
        }

        const lesson = lessonResult.rows[0];

        // კოდის შემოწმება (ბაზისური)
        let passed = false;
        let score = 0;
        let testResults = [];

        // კომენტარების მოცილება შემოწმებამდე
        const codeWithoutComments = code
            .replace(/<!--[\s\S]*?-->/g, '') // HTML comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // CSS/JS multi-line
            .replace(/\/\/.*/g, ''); // JS single-line

        if (lesson.test_cases) {
            // JSON ტესტ-ქეისების შემოწმება
            const tests = typeof lesson.test_cases === 'string' ? JSON.parse(lesson.test_cases) : lesson.test_cases;
            testResults = tests.map(test => {
                const testName = test.name || test.testName;
                let testPassed = false;
                let expected = test.contains;

                if (test.contains) {
                    testPassed = codeWithoutComments.toLowerCase().includes(test.contains.toLowerCase());
                } else if (test.testCode) {
                    const queryMatch = test.testCode.match(/querySelector\(['"]([^'"]+)['"]\)/);
                    const innerTextMatch = test.testCode.match(/\.innerText\)\.toBe\(['"]([^'"]+)['"]\)/);
                    const toContainMatch = test.testCode.match(/\.toContain\(['"]([^'"]+)['"]\)/);

                    if (queryMatch) {
                        const tag = queryMatch[1];
                        if (innerTextMatch) {
                            const expectedText = innerTextMatch[1];
                            testPassed = codeWithoutComments.toLowerCase().includes(`<${tag}`) &&
                                codeWithoutComments.toLowerCase().includes(expectedText.toLowerCase());
                        } else {
                            expected = `<${tag}`;
                            testPassed = codeWithoutComments.toLowerCase().includes(expected.toLowerCase());
                        }
                    } else if (toContainMatch) {
                        // Bug 3: Basic string match eval for JS lessons using toContain
                        const expectedText = toContainMatch[1];
                        testPassed = codeWithoutComments.toLowerCase().includes(expectedText.toLowerCase());
                    } else if (test.testCode && (test.testCode.toLowerCase().includes('doctype') || testName.toLowerCase().includes('doctype'))) {
                        testPassed = code.toLowerCase().includes('<!doctype html>');
                    } else {
                        testPassed = false;
                    }
                }

                return {
                    name: testName,
                    passed: testPassed,
                    expected: expected || 'კოდის ვალიდაცია'
                };
            });
            const passedTests = testResults.filter(t => t.passed).length;
            score = Math.round((passedTests / tests.length) * 100);
            passed = score === 100;
        } else if (lesson.solution_code) {
            const normalizedCode = codeWithoutComments.replace(/\s+/g, ' ').trim().toLowerCase();
            const normalizedSolution = lesson.solution_code.replace(/\s+/g, ' ').trim().toLowerCase();

            // შემოწმება - შეიცავს თუ არა კოდი მთავარ ელემენტებს
            const solutionParts = extractKeyParts(lesson.solution_code);
            let matchedParts = 0;

            solutionParts.forEach(part => {
                if (normalizedCode.includes(part.toLowerCase())) {
                    matchedParts++;
                    testResults.push({ name: part, passed: true });
                } else {
                    testResults.push({ name: part, passed: false });
                }
            });

            score = solutionParts.length > 0 ? Math.round((matchedParts / solutionParts.length) * 100) : 0;
            passed = score >= 60;
        }

        // სუბმიშენის შენახვა
        await query(
            `INSERT INTO code_submissions (user_id, lesson_id, code, language, passed, score, test_results) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [req.user.id, lessonId, code, lesson.language, passed, score, JSON.stringify(testResults)]
        );

        // პროგრესის განახლება
        if (passed) {
            const existing = await query(
                'SELECT id, status FROM user_progress WHERE user_id = $1 AND lesson_id = $2',
                [req.user.id, lessonId]
            );

            if (existing.rows.length === 0) {
                await query(
                    `INSERT INTO user_progress (user_id, lesson_id, course_id, status, best_score, attempts, completed_at) 
           VALUES ($1, $2, $3, 'completed', $4, 1, NOW())`,
                    [req.user.id, lessonId, lesson.course_id, score]
                );

                // XP დამატება
                await query(
                    'UPDATE users SET xp_points = xp_points + $1 WHERE id = $2',
                    [lesson.xp_reward, req.user.id]
                );

                // Level-ის გადაანგარიშება (ყოველ 100 XP-ზე level იზრდება)
                await query(
                    'UPDATE users SET level = GREATEST(1, FLOOR(xp_points / 100) + 1) WHERE id = $1',
                    [req.user.id]
                );
            } else {
                await query(
                    `UPDATE user_progress SET status = 'completed', best_score = GREATEST(best_score, $1), 
           attempts = attempts + 1, last_attempt_at = NOW(), completed_at = COALESCE(completed_at, NOW())
           WHERE user_id = $2 AND lesson_id = $3`,
                    [score, req.user.id, lessonId]
                );
            }
        } else {
            // არ ჩაბარდა, მაგრამ პროგრესის აღნიშვნა
            await query(
                `INSERT INTO user_progress (user_id, lesson_id, course_id, status, best_score, attempts) 
         VALUES ($1, $2, $3, 'in_progress', $4, 1)
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET 
         attempts = user_progress.attempts + 1, best_score = GREATEST(user_progress.best_score, $4), last_attempt_at = NOW()`,
                [req.user.id, lessonId, lesson.course_id, score]
            );
        }

        res.json({
            passed,
            score,
            testResults,
            xpEarned: passed ? lesson.xp_reward : 0,
            message: passed ? '🎉 შესანიშნავია! ლექცია წარმატებით დასრულდა!' : '❌ სცადეთ ხელახლა. შეამოწმეთ კოდი.'
        });
    } catch (error) {
        next(error);
    }
};

// Helper: solution-კოდის მთავარი ნაწილების ამოღება
function extractKeyParts(solutionCode) {
    const parts = [];
    // HTML ტეგების ამოღება
    const tagRegex = /<(!?[\w.-]+)[^>]*>/g;
    let match;
    while ((match = tagRegex.exec(solutionCode)) !== null) {
        if (!['meta', 'link', '!doctype'].includes(match[1].toLowerCase())) {
            parts.push(`<${match[1]}`);
        }
    }
    // CSS თვისებების ამოღება
    const cssRegex = /(\w[\w-]+)\s*:\s*([^;]+);/g;
    while ((match = cssRegex.exec(solutionCode)) !== null) {
        parts.push(`${match[1]}:`);
    }
    // JS ქივორდების ამოღება
    const jsKeywords = ['function', 'const ', 'let ', 'console.log', 'return ', 'if ', 'for '];
    jsKeywords.forEach(kw => {
        if (solutionCode.includes(kw)) parts.push(kw.trim());
    });

    return [...new Set(parts)].slice(0, 10);
}

// ========================================
// AI დამხმარე სტუდენტებისთვის
// ========================================
const askAI = async (req, res, next) => {
    try {
        const { lessonId, currentCode, challengeText, lessonContent, language } = req.body;

        if (!genAI) return res.status(503).json({ error: 'AI სერვისი მიუწვდომელია.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
            შენ ხარ პროგრამირების მასწავლებელი. დაეხმარე სტუდენტს, რომელიც ასრულებს დავალებას.
            
            დავალება (ქართულად): "${challengeText}"
            ლექციის თეორია: "${lessonContent}"
            სტუდენტის ამჟამინდელი კოდი (${language}):
            \`\`\`${language}
            ${currentCode}
            \`\`\`
            
            წესები:
            1. არ მისცე სტუდენტს გამზადებული პასუხი ან კოდი.
            2. მიეცი მცირე მინიშნება (Hint), რაც მას დაეხმარება პრობლემის პოვნაში.
            3. ტექსტი უნდა იყოს მოკლე, გამართულ ქართულ ენაზე და მეგობრული.
            4. თუ კოდი თითქმის სწორია, შეაქე ის და მიუთითე მცირე დეტალზე.
            
            დააბრუნე პასუხი მხოლოდ ტექსტური მინიშნების სახით.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ hint: responseText });
    } catch (error) {
        next(error);
    }
};

const explainAI = async (req, res, next) => {
    try {
        const { currentCode, error, challengeText, language } = req.body;

        if (!genAI) return res.status(503).json({ error: 'AI სერვისი მიუწვდომელია.' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
            შენ ხარ პროგრამირების მასწავლებელი. დაეხმარე სტუდენტს კოდის ან შეცდომის გაგებაში.
            
            დავალება: "${challengeText}"
            სტუდენტის კოდი (${language}):
            \`\`\`${language}
            ${currentCode}
            \`\`\`
            
            კონკრეტული შეცდომა ან კითხვა: "${error || 'ამიხსენი ეს კოდი და რატომ არ მუშაობს'}"
            
            წესები:
            1. აუხსენი მარტივი ენით, რა ხდება კოდში.
            2. თუ არის შეცდომა, მიუთითე მიზეზზე.
            3. ტექსტი უნდა იყოს გამართულ ქართულ ენაზე.
            4. ნუ მისცემ პირდაპირ სწორ კოდს, დაეხმარე მიხვედრაში.
            
            დააბრუნე მხოლოდ ახსნა-განმარტება.
        `;

        const result = await model.generateContent(prompt);
        res.json({ explanation: result.response.text() });
    } catch (err) {
        next(err);
    }
};

module.exports = { getLesson, submitCode, askAI, explainAI };
