const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Route: /api/auth/register
router.post('/register', registerUser);

// Route: /api/auth/login
router.post('/login', loginUser);

// Route: /api/auth/profile
router.get('/profile', protect, getUserProfile);

module.exports = router;