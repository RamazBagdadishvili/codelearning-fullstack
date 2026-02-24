// ============================================
// ავტორიზაციის როუტები
// ============================================

const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// რეგისტრაცია
router.post('/register', [
    body('email').isEmail().withMessage('გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა.'),
    body('username').isLength({ min: 3, max: 50 }).withMessage('მომხმარებლის სახელი უნდა იყოს 3-50 სიმბოლო.'),
    body('password').isLength({ min: 6 }).withMessage('პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.'),
    validate
], register);

// შესვლა
router.post('/login', [
    body('email').isEmail().withMessage('გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა.'),
    body('password').notEmpty().withMessage('პაროლი აუცილებელია.'),
    validate
], login);

// პროფილი
router.get('/me', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
