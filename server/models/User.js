const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Role hierarchy for permission checking
  static ROLE_HIERARCHY = {
    'super-admin': 10,
    'admin': 9,
    'creator': 8,
    'mentor': 5,
    'tutor': 5,
    'publisher': 4,
    'merchant': 4,
    'tuition-center': 4,
    'parent': 3,
    'student': 2,
    'user': 1
  };

  // Create new user
  static async create(email, password, name, role = 'user', createdBy = null) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      // Try with new columns
      const [result] = await pool.execute(
        `INSERT INTO users (email, password, name, role, status, created_by) 
         VALUES (?, ?, ?, ?, 'active', ?)`,
        [email, hashedPassword, name, role, createdBy]
      );
      
      // Create user profile (ignore error if table doesn't exist)
      try {
        await pool.execute(
          'INSERT INTO user_profiles (user_id) VALUES (?)',
          [result.insertId]
        );
      } catch (profileError) {
        // user_profiles table doesn't exist yet, that's ok
      }
      
      return result.insertId;
    } catch (error) {
      // Fallback to basic insert if new columns don't exist
      const [result] = await pool.execute(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, role]
      );
      return result.insertId;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        `SELECT u.*, up.bio, up.city, up.state, up.country 
         FROM users u 
         LEFT JOIN user_profiles up ON u.id = up.user_id 
         WHERE u.email = ?`,
        [email]
      );
      return rows[0];
    } catch (error) {
      // Fallback to simple query if user_profiles doesn't exist yet
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        `SELECT u.id, u.email, u.name, u.role, u.status, u.avatar_url, u.phone, 
                u.last_login, u.email_verified, u.phone_verified, u.created_at, u.updated_at,
                up.bio, up.city, up.state, up.country
         FROM users u 
         LEFT JOIN user_profiles up ON u.id = up.user_id 
         WHERE u.id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      // Fallback to simple query if columns don't exist yet
      const [rows] = await pool.execute(
        'SELECT id, email, name, role, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    }
  }

  // Get all users with pagination and filters
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      role = null,
      status = null,
      search = '',
      dateFrom = null,
      dateTo = null,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    try {
      let whereClause = 'WHERE 1=1';
      const params = [];

      if (role) {
        whereClause += ' AND u.role = ?';
        params.push(role);
      }

      if (status) {
        whereClause += ' AND u.status = ?';
        params.push(status);
      }

      if (search) {
        whereClause += ' AND (u.name LIKE ? OR u.email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (dateFrom) {
        whereClause += ' AND u.created_at >= ?';
        params.push(dateFrom);
      }

      if (dateTo) {
        whereClause += ' AND u.created_at <= ?';
        params.push(dateTo);
      }

      // Get total count
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM users u ${whereClause}`,
        params
      );
      const total = countResult[0].total;

      // Get users
      const offset = (page - 1) * limit;
      const [rows] = await pool.query(
        `SELECT u.id, u.email, u.name, u.role, u.status, u.avatar_url, 
                u.last_login, u.email_verified, u.created_at, u.updated_at
         FROM users u 
         ${whereClause}
         ORDER BY u.${sortBy} ${sortOrder}
         LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), parseInt(offset)]
      );

      return {
        users: rows,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      // Fallback to basic query
      const offset = (page - 1) * limit;
      const [rows] = await pool.query(
        'SELECT id, email, name, role, created_at, updated_at FROM users LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)]
      );
      const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
      
      return {
        users: rows,
        total: countResult[0].total,
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    }
  }

  // Update user
  static async update(id, updateData) {
    const allowedFields = ['name', 'email', 'phone', 'avatar_url', 'status', 'role'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return false;

    try {
      values.push(id);
      const [result] = await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      // Fallback: try with only basic fields
      const basicFields = ['name', 'email', 'role'];
      const basicUpdates = [];
      const basicValues = [];
      
      for (const [key, value] of Object.entries(updateData)) {
        if (basicFields.includes(key) && value !== undefined) {
          basicUpdates.push(`${key} = ?`);
          basicValues.push(value);
        }
      }
      
      if (basicUpdates.length === 0) return false;
      
      basicValues.push(id);
      const [result] = await pool.execute(
        `UPDATE users SET ${basicUpdates.join(', ')} WHERE id = ?`,
        basicValues
      );
      return result.affectedRows > 0;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const allowedFields = [
        'bio', 'address', 'city', 'state', 'country', 'postal_code',
        'date_of_birth', 'gender', 'education_level', 'occupation',
        'website', 'social_links'
      ];
      
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(profileData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) return false;

      values.push(userId);
      const [result] = await pool.execute(
        `UPDATE user_profiles SET ${updates.join(', ')} WHERE user_id = ?`,
        values
      );

      // If no rows updated, insert new profile
      if (result.affectedRows === 0) {
        const fields = Object.keys(profileData).filter(f => allowedFields.includes(f) && profileData[f] !== undefined);
        const placeholders = fields.map(() => '?').join(', ');
        const fieldValues = fields.map(f => profileData[f]);
        await pool.execute(
          `INSERT INTO user_profiles (user_id, ${fields.join(', ')}) VALUES (?, ${placeholders})`,
          [userId, ...fieldValues]
        );
      }

      return true;
    } catch (error) {
      // Table doesn't exist yet
      console.log('user_profiles table not available:', error.message);
      return false;
    }
  }

  // Update user status
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      // Column doesn't exist yet
      return false;
    }
  }

  // Update user role
  static async updateRole(id, role) {
    const [result] = await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );
    return result.affectedRows > 0;
  }

  // Delete user
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  // Bulk delete users
  static async bulkDelete(ids) {
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await pool.execute(
      `DELETE FROM users WHERE id IN (${placeholders})`,
      ids
    );
    return result.affectedRows;
  }

  // Update last login
  static async updateLastLogin(id) {
    try {
      await pool.execute(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    } catch (error) {
      // Column doesn't exist yet, ignore
    }
  }

  // Change password
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }

  // Get user permissions
  static async getPermissions(role) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.name, p.module, p.action, p.description
         FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role = ?`,
        [role]
      );
      return rows;
    } catch (error) {
      // Tables don't exist yet, return empty array
      return [];
    }
  }

  // Get all permissions
  static async getAllPermissions() {
    const [rows] = await pool.execute(
      'SELECT * FROM permissions ORDER BY module, action'
    );
    return rows;
  }

  // Get user statistics
  static async getStats() {
    try {
      const [roleStats] = await pool.execute(
        `SELECT role, COUNT(*) as count 
         FROM users 
         GROUP BY role`
      );

      let statusStats = [];
      try {
        const [result] = await pool.execute(
          `SELECT status, COUNT(*) as count 
           FROM users 
           GROUP BY status`
        );
        statusStats = result;
      } catch (e) {
        // status column doesn't exist
      }

      let recentStats = [{ total_users: 0, new_this_week: 0, new_this_month: 0, active_this_week: 0 }];
      try {
        const [result] = await pool.execute(
          `SELECT 
            COUNT(*) as total_users,
            COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_this_week,
            COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month,
            COUNT(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_this_week
           FROM users`
        );
        recentStats = result;
      } catch (e) {
        // Fallback query without last_login
        const [result] = await pool.execute('SELECT COUNT(*) as total_users FROM users');
        recentStats = [{ 
          total_users: result[0].total_users, 
          new_this_week: 0, 
          new_this_month: 0, 
          active_this_week: 0 
        }];
      }

      return {
        byRole: roleStats,
        byStatus: statusStats,
        overview: recentStats[0]
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      return {
        byRole: [],
        byStatus: [],
        overview: { total_users: 0, new_this_week: 0, new_this_month: 0, active_this_week: 0 }
      };
    }
  }

  // Log user activity
  static async logActivity(userId, action, entityType = null, entityId = null, details = {}) {
    try {
      await pool.execute(
        `INSERT INTO user_activity_logs 
         (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          action,
          entityType,
          entityId,
          details.oldValues ? JSON.stringify(details.oldValues) : null,
          details.newValues ? JSON.stringify(details.newValues) : null,
          details.ipAddress || null,
          details.userAgent || null
        ]
      );
    } catch (error) {
      // Table doesn't exist yet, silently ignore
      console.log('Activity logging not available:', error.message);
    }
  }

  // Get user activity logs
  static async getActivityLogs(userId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const [rows] = await pool.execute(
        `SELECT * FROM user_activity_logs 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM user_activity_logs WHERE user_id = ?',
        [userId]
      );

      return {
        activities: rows,
        total: countResult[0].total,
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      // Table doesn't exist yet
      return {
        activities: [],
        total: 0,
        currentPage: 1,
        totalPages: 0
      };
    }
  }

  // Check if user can manage another user based on role hierarchy
  static canManageRole(managerRole, targetRole) {
    const managerLevel = this.ROLE_HIERARCHY[managerRole] || 0;
    const targetLevel = this.ROLE_HIERARCHY[targetRole] || 0;
    return managerLevel > targetLevel;
  }

  // Get allowed roles for a user to create/manage
  static getManageableRoles(userRole) {
    const userLevel = this.ROLE_HIERARCHY[userRole] || 0;
    return Object.entries(this.ROLE_HIERARCHY)
      .filter(([_, level]) => level < userLevel)
      .map(([role, _]) => role);
  }
}

module.exports = User;
