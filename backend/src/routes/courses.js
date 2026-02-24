// ============================================
// კურსების როუტები
// ============================================

const router = require('express').Router();
const { getAllCourses, getCourseBySlug, enrollCourse, unenrollCourse, getCategories } = require('../controllers/courseController');
const auth = require('../middleware/auth');

// კატეგორიების მიღება (ეს უნდა იყოს :slug-ის ზემოთ)
router.get('/categories', getCategories);

// ყველა კურსი (ფილტრაციით)
router.get('/', getAllCourses);

// ერთი კურსი slug-ით
router.get('/:slug', (req, res, next) => {
    // Optional auth - ცდილობს ავტორიზაციას, მაგრამ არ აბრუნებს error-ს
    const authHeader = req.headers.authorization;
    if (authHeader) {
        auth(req, res, () => next());
    } else {
        next();
    }
}, getCourseBySlug);

// კურსში ჩარიცხვა
router.post('/:id/enroll', auth, enrollCourse);

// კურსიდან ამოწერა
router.delete('/:id/unenroll', auth, unenrollCourse);

module.exports = router;
