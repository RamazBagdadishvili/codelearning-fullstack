// ადმინ როუტები
const router = require('express').Router();
const {
    getStats, createCourse, updateCourse, createLesson, updateLesson,
    deleteCourse, getUsers, getCourses, deleteLesson,
    updateUserRole, toggleUserActive, deleteUser, updateUserLevel, updateUserXp,
    getAnalytics, broadcastNotification, sendNotification,
    getAchievements, createAchievement, updateAchievement, deleteAchievement,
    getSubmissions, clearAllSubmissions, reorderLessons,
    getUserEnrollments, enrollUser, unenrollUser, getLessonById,
    generateTestCases, generateFullLesson, generateLessonContent, generateCodeChallenge, cloneLesson, cloneCourse
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const instructor = require('../middleware/instructor');

// ყველა როუტი მოითხოვს ავტორიზაციას
router.use(auth);

// ==========================================
// ადმინის ექსკლუზიური როუტები (მხოლოდ Role: admin)
// ==========================================

// სტატისტიკა და ანალიტიკა
router.get('/stats', admin, getStats);
router.get('/analytics', admin, getAnalytics);

// მომხმარებლების მართვა
router.get('/users', admin, getUsers);
router.put('/users/:id/role', admin, updateUserRole);
router.put('/users/:id/toggle-active', admin, toggleUserActive);
router.put('/users/:id/level', admin, updateUserLevel);
router.put('/users/:id/xp', admin, updateUserXp);
router.get('/users/:id/enrollments', admin, getUserEnrollments);
router.post('/users/:id/enroll', admin, enrollUser);
router.delete('/users/:id/unenroll/:courseId', admin, unenrollUser);
router.delete('/users/:id', admin, deleteUser);

// შეტყობინებები
router.post('/notifications/broadcast', admin, broadcastNotification);
router.post('/notifications/send', admin, sendNotification);

// მიღწევები
router.get('/achievements', admin, getAchievements);
router.post('/achievements', admin, createAchievement);
router.put('/achievements/:id', admin, updateAchievement);
router.delete('/achievements/:id', admin, deleteAchievement);

// სუბმიშენები
router.get('/submissions', admin, getSubmissions);
router.delete('/submissions/clear', admin, clearAllSubmissions);

// ==========================================
// ინსტრუქტორის როუტები (Role: admin OR instructor)
// ==========================================

// შენიშვნა: ინსტრუქტორებს შეუძლიათ დაამატონ, შეცვალონ და წაშალონ კურსები/ლექციები
// Controller-ის დონეზე უნდა მოხდეს შემოწმება რომ ინსტრუქტორი მხოლოდ თავის კურსს ცვლის
// ამ ეტაპზე middleware უშვებს ორივე როლს

// კურსები
router.get('/courses', instructor, getCourses);
router.post('/courses', instructor, createCourse);
router.put('/courses/:id', instructor, updateCourse);
router.post('/courses/:id/clone', instructor, cloneCourse);
router.delete('/courses/:id', instructor, deleteCourse);

// ლექციები
router.get('/lessons/:id', instructor, getLessonById);
router.post('/lessons', instructor, createLesson);
router.post('/lessons/:id/clone', instructor, cloneLesson);
router.put('/lessons/reorder', instructor, reorderLessons);
router.put('/lessons/:id', instructor, updateLesson);
router.delete('/lessons/:id', instructor, deleteLesson);
router.post('/lessons/generate-tests', instructor, generateTestCases);
router.post('/lessons/generate-full', instructor, generateFullLesson);
router.post('/lessons/generate-content', instructor, generateLessonContent);
router.post('/lessons/generate-challenge', instructor, generateCodeChallenge);

module.exports = router;
