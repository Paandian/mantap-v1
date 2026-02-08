const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user is active
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account inactive' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!['super-admin', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};

const requirePermission = (permission) => {
  return async (req, res, next) => {
    if (req.user.role === 'super-admin') {
      return next();
    }

    const permissions = await User.getPermissions(req.user.role);
    const permissionNames = permissions.map(p => p.name);

    if (!permissionNames.includes(permission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next();
  };
};

module.exports = { 
  authenticateToken, 
  requireAdmin, 
  requireRole,
  requirePermission 
};
