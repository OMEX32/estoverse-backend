const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected route (authentication required)
router.get('/me', authenticate, getMe);

module.exports = router;