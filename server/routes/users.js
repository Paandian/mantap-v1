const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { uploadAvatar, handleMulterError } = require('../middleware/upload');
const userController = require('../controllers/userController');

// All routes require authentication
router.use(authenticateToken);

// Profile routes (for current user)
router.get('/me/profile', userController.getMyProfile);
router.put('/me/profile', userController.updateMyProfile);
router.post('/me/avatar', uploadAvatar, handleMulterError, userController.uploadAvatar);

// Get all users (Admin, Creator, Super-admin only)
router.get('/', requireRole(['super-admin', 'admin', 'creator']), userController.getUsers);

// Get user statistics (Admin, Creator, Super-admin only)
router.get('/stats', requireRole(['super-admin', 'admin', 'creator']), userController.getUserStats);

// Export users (Admin, Super-admin only)
router.get('/export', requireRole(['super-admin', 'admin']), userController.exportUsers);

// Get single user
router.get('/:id', userController.getUserById);

// Get user activity logs
router.get('/:id/activity', userController.getUserActivity);

// Create new user (Admin, Creator, Super-admin only)
router.post('/', requireRole(['super-admin', 'admin', 'creator']), userController.createUser);

// Bulk operations (Admin, Super-admin only)
router.post('/bulk-delete', requireRole(['super-admin', 'admin']), userController.bulkDeleteUsers);
router.post('/bulk-status', requireRole(['super-admin', 'admin']), userController.bulkUpdateStatus);

// Update user
router.put('/:id', userController.updateUser);

// Update user role (Admin, Super-admin only)
router.patch('/:id/role', requireRole(['super-admin', 'admin']), userController.updateUserRole);

// Update user status (Admin, Super-admin only)
router.patch('/:id/status', requireRole(['super-admin', 'admin']), userController.updateUserStatus);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
