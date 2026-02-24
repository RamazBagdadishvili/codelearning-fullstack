// ============================================
// ავტორიზაციის კონტროლერი
// ============================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// ტოკენის გენერაცია
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// ============================================
// რეგისტრაცია
// POST /api/auth/register
// ============================================
const register = async (req, res, next) => {
    try {
        const { email, username, password, fullName } = req.body;

        // შემოწმება - არსებობს თუ არა მომხმარებელი
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'ეს ელ-ფოსტა ან მომხმარებლის სახელი უკვე დარეგისტრირებულია.' });
        }

        // პაროლის ჰეშირება
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // მომხმარებლის შექმნა
        const result = await query(
            `INSERT INTO users (email, username, password_hash, full_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, username, full_name, role, xp_points, level, created_at`,
            [email, username, passwordHash, fullName || username]
        );

        const user = result.rows[0];
        const token = generateToken(user.id);

        // შეტყობინების შექმნა
        await query(
            `INSERT INTO notifications (user_id, type, title, message) 
       VALUES ($1, 'welcome', 'კეთილი იყოს თქვენი მობრძანება!', 'მოგესალმებით CodeLearning-ზე! დაიწყეთ სწავლა პირველი კურსით.')`,
            [user.id]
        );

        res.status(201).json({
            message: 'რეგისტრაცია წარმატებულია!',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.full_name,
                role: user.role,
                xpPoints: user.xp_points,
                level: user.level
            }
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// შესვლა
// POST /api/auth/login
// ============================================
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // მომხმარებლის მოძიება
        const result = await query(
            'SELECT id, email, username, password_hash, full_name, role, xp_points, level, streak_days, avatar_url FROM users WHERE email = $1 AND is_active = true',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'არასწორი ელ-ფოსტა ან პაროლი.' });
        }

        const user = result.rows[0];

        // პაროლის შემოწმება
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'არასწორი ელ-ფოსტა ან პაროლი.' });
        }

        // Streak-ის განახლება
        const today = new Date().toISOString().split('T')[0];
        const lastActive = user.last_active_date;
        let newStreak = user.streak_days;

        if (lastActive) {
            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newStreak += 1;
            } else if (diffDays > 1) {
                newStreak = 1;
            }
        }

        await query(
            'UPDATE users SET last_active_date = $1, streak_days = $2, longest_streak = GREATEST(longest_streak, $2) WHERE id = $3',
            [today, newStreak, user.id]
        );

        const token = generateToken(user.id);

        res.json({
            message: 'შესვლა წარმატებულია!',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.full_name,
                role: user.role,
                xpPoints: user.xp_points,
                level: user.level,
                streakDays: newStreak,
                avatarUrl: user.avatar_url
            }
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// პროფილის მიღება
// GET /api/auth/me
// ============================================
const getProfile = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, email, username, full_name, avatar_url, role, xp_points, level, 
              streak_days, longest_streak, bio, created_at,
              (SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND status = 'completed') as completed_lessons,
              (SELECT COUNT(DISTINCT course_id) FROM course_enrollments WHERE user_id = $1) as enrolled_courses,
              (SELECT COUNT(*) FROM user_achievements WHERE user_id = $1) as total_achievements,
              (SELECT COUNT(*) FROM code_submissions WHERE user_id = $1) as total_submissions
       FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა.' });
        }

        const user = result.rows[0];
        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.full_name,
                avatarUrl: user.avatar_url,
                role: user.role,
                xpPoints: user.xp_points,
                level: user.level,
                streakDays: user.streak_days,
                longestStreak: user.longest_streak,
                bio: user.bio,
                createdAt: user.created_at,
                stats: {
                    completedLessons: parseInt(user.completed_lessons),
                    enrolledCourses: parseInt(user.enrolled_courses),
                    totalAchievements: parseInt(user.total_achievements),
                    totalSubmissions: parseInt(user.total_submissions)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// ============================================
// პროფილის განახლება
// PUT /api/auth/profile
// ============================================
const updateProfile = async (req, res, next) => {
    try {
        const { fullName, bio, avatarUrl } = req.body;

        const result = await query(
            `UPDATE users SET full_name = COALESCE($1, full_name), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url), updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, username, full_name, bio, avatar_url, role, xp_points, level`,
            [fullName, bio, avatarUrl, req.user.id]
        );

        res.json({ message: 'პროფილი წარმატებით განახლდა.', user: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile, updateProfile };
