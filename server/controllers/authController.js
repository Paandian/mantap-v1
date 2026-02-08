const User = require('../models/User');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }

  // Only allow specific roles on registration, default to 'user'
  const allowedRoles = ['user', 'student', 'parent', 'tutor', 'mentor'];
  const assignedRole = allowedRoles.includes(role) ? role : 'user';

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await User.create(email, password, name, assignedRole);

    // Get user data for response
    const user = await User.findById(userId);

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Get permissions
    const permissions = await User.getPermissions(user.role);
    const permissionNames = permissions.map(p => p.name);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      },
      permissions: permissionNames
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check user status (default to 'active' if column doesn't exist yet)
    const userStatus = user.status || 'active';
    if (userStatus === 'suspended') {
      return res.status(403).json({ message: 'Account suspended. Contact support.' });
    }

    if (userStatus === 'inactive') {
      return res.status(403).json({ message: 'Account inactive. Please verify your email.' });
    }

    if (userStatus === 'pending') {
      return res.status(403).json({ message: 'Account pending approval.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Get permissions (fallback to empty array if table doesn't exist)
    let permissions = [];
    let permissionNames = [];
    try {
      permissions = await User.getPermissions(user.role);
      permissionNames = permissions.map(p => p.name);
    } catch (permError) {
      console.log('Permissions table not available yet');
    }

    // Log activity (ignore error if table doesn't exist)
    try {
      await User.logActivity(user.id, 'login', null, null, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (logError) {
      // Activity logging not available yet
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status || 'active',
        avatar_url: user.avatar_url || null
      },
      permissions: permissionNames
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const logout = async (req, res) => {
  try {
    // Log activity (ignore error if table doesn't exist)
    try {
      await User.logActivity(req.user.id, 'logout', null, null, {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    } catch (logError) {
      // Activity logging not available yet
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get permissions (fallback to empty array if table doesn't exist)
    let permissionNames = [];
    try {
      const permissions = await User.getPermissions(user.role);
      permissionNames = permissions.map(p => p.name);
    } catch (permError) {
      console.log('Permissions table not available yet');
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status || 'active',
        avatar_url: user.avatar_url || null,
        phone: user.phone || null,
        bio: user.bio || null
      },
      permissions: permissionNames
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, avatar_url } = req.body;
    const userId = req.user.id;

    const existingUser = await User.findById(userId);

    await User.update(userId, { name, phone, avatar_url });
    await User.updateProfile(userId, { bio });

    const updatedUser = await User.findById(userId);

    // Log activity (ignore error if table doesn't exist)
    try {
      await User.logActivity(userId, 'profile_updated', 'user', userId, {
        oldValues: existingUser,
        newValues: { name, phone, bio, avatar_url }
      });
    } catch (logError) {
      // Activity logging not available yet
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone || null,
        bio: updatedUser.bio || null,
        avatar_url: updatedUser.avatar_url || null
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    // Get user with password
    const [rows] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    await User.changePassword(userId, newPassword);

    // Log activity
    await User.logActivity(userId, 'password_changed', 'user', userId);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Failed to refresh token' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshToken
};
