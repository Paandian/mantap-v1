const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshToken
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.post('/refresh', authenticateToken, refreshToken);

module.exports = router;
