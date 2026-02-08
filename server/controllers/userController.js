const User = require('../models/User');

// Get all users with pagination and filters
const getUsers = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      role: req.query.role || null,
      status: req.query.status || null,
      search: req.query.search || '',
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    };

    const result = await User.findAll(options);
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user can view this user
    if (req.user.role !== 'super-admin' && req.user.role !== 'admin' && req.user.role !== 'creator') {
      if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Email, password, and name are required' 
      });
    }

    // Check if current user can create this role
    if (!User.canManageRole(req.user.role, role)) {
      return res.status(403).json({ 
        message: 'You cannot create users with this role' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const userId = await User.create(email, password, name, role, req.user.id);
    const user = await User.findById(userId);

    // Log activity
    await User.logActivity(req.user.id, 'user_created', 'user', userId, {
      newValues: { email, name, role }
    });

    res.status(201).json({ 
      message: 'User created successfully',
      user 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, avatar_url, status, role } = req.body;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role !== 'super-admin' && req.user.role !== 'admin' && req.user.role !== 'creator') {
      if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Only super-admin and admin can change status
    if (status && !['super-admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Cannot change user status' });
    }

    const updateData = { name, email, phone, avatar_url };
    if (status && ['super-admin', 'admin'].includes(req.user.role)) {
      updateData.status = status;
    }

    // Handle role update - only super-admin and admin can change roles
    if (role && role !== existingUser.role) {
      if (!['super-admin', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Cannot change user role' });
      }
      
      // Check if current user can assign this role
      if (!User.canManageRole(req.user.role, role)) {
        return res.status(403).json({ message: 'Cannot assign this role' });
      }
      
      // Check if current user can manage the target user's current role
      if (!User.canManageRole(req.user.role, existingUser.role)) {
        return res.status(403).json({ message: 'Cannot modify this user' });
      }
      
      updateData.role = role;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    await User.update(userId, updateData);
    const updatedUser = await User.findById(userId);

    // Log activity
    await User.logActivity(req.user.id, 'user_updated', 'user', userId, {
      oldValues: existingUser,
      newValues: updateData
    });

    res.json({ 
      message: 'User updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current user can assign this role
    if (!User.canManageRole(req.user.role, role)) {
      return res.status(403).json({ message: 'Cannot assign this role' });
    }

    // Check if current user can manage the target user's current role
    if (!User.canManageRole(req.user.role, existingUser.role)) {
      return res.status(403).json({ message: 'Cannot modify this user' });
    }

    await User.updateRole(userId, role);
    const updatedUser = await User.findById(userId);

    // Log activity
    await User.logActivity(req.user.id, 'role_changed', 'user', userId, {
      oldValues: { role: existingUser.role },
      newValues: { role }
    });

    res.json({ 
      message: 'User role updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (!['super-admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await User.updateStatus(userId, status);
    const updatedUser = await User.findById(userId);

    // Log activity
    await User.logActivity(req.user.id, 'status_changed', 'user', userId, {
      oldValues: { status: existingUser.status },
      newValues: { status }
    });

    res.json({ 
      message: 'User status updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (!User.canManageRole(req.user.role, existingUser.role)) {
      return res.status(403).json({ message: 'Cannot delete this user' });
    }

    // Prevent self-deletion
    if (req.user.id === parseInt(userId)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.delete(userId);

    // Log activity
    await User.logActivity(req.user.id, 'user_deleted', 'user', userId, {
      oldValues: existingUser
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Bulk delete users
const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    // Filter out current user and users with higher/equal role
    const deletableIds = [];
    for (const userId of userIds) {
      if (req.user.id === parseInt(userId)) continue;
      
      const user = await User.findById(userId);
      if (user && User.canManageRole(req.user.role, user.role)) {
        deletableIds.push(userId);
      }
    }

    if (deletableIds.length === 0) {
      return res.status(403).json({ message: 'No users can be deleted' });
    }

    const deletedCount = await User.bulkDelete(deletableIds);

    // Log activity
    await User.logActivity(req.user.id, 'users_bulk_deleted', 'user', null, {
      newValues: { deletedIds: deletableIds, count: deletedCount }
    });

    res.json({ 
      message: `${deletedCount} users deleted successfully`,
      deletedCount 
    });
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    res.status(500).json({ message: 'Failed to delete users' });
  }
};

// Bulk update status
const bulkUpdateStatus = async (req, res) => {
  try {
    const { userIds, status } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    if (!['active', 'inactive', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let updatedCount = 0;
    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (user && User.canManageRole(req.user.role, user.role)) {
        await User.updateStatus(userId, status);
        updatedCount++;
      }
    }

    // Log activity
    await User.logActivity(req.user.id, 'users_bulk_status_update', 'user', null, {
      newValues: { userIds, status, count: updatedCount }
    });

    res.json({ 
      message: `${updatedCount} users updated successfully`,
      updatedCount 
    });
  } catch (error) {
    console.error('Error bulk updating status:', error);
    res.status(500).json({ message: 'Failed to update users' });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

// Get user activity logs
const getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    };

    // Check permissions
    if (req.user.role !== 'super-admin' && req.user.role !== 'admin') {
      if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const result = await User.getActivityLogs(userId, options);
    res.json(result);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Failed to fetch activity logs' });
  }
};

// Export users
const exportUsers = async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const options = {
      role: req.query.role || null,
      status: req.query.status || null,
      search: req.query.search || '',
      dateFrom: req.query.dateFrom || null,
      dateTo: req.query.dateTo || null,
      limit: 10000 // Max export limit
    };

    const result = await User.findAll(options);

    if (format === 'csv') {
      // Generate CSV
      const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Phone', 'Last Login', 'Created At'];
      const rows = result.users.map(u => [
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        u.phone || '',
        u.last_login || '',
        u.created_at
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=users_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } else {
      res.status(400).json({ message: 'Unsupported format' });
    }
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ message: 'Failed to export users' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  bulkDeleteUsers,
  bulkUpdateStatus,
  getUserStats,
  getUserActivity,
  exportUsers
};
