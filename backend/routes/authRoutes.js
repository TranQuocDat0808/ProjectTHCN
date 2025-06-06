const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes (require authentication)
router.get('/profile', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;
