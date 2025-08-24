const { signup, login, getProfile, updateProfile, updatePassword, updateProfilePicture, verifyToken } = require('../controllers/auth');
const router = require('express').Router();

router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/password', verifyToken, updatePassword);
router.put('/profile-picture', verifyToken, updateProfilePicture);

module.exports = router; 