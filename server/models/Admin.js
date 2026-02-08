const pool = require('../config/db');

class Admin {
  static async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM admins WHERE user_id = ?', [userId]);
    return rows[0];
  }

  static async create(userId) {
    const [result] = await pool.execute('INSERT INTO admins (user_id) VALUES (?)', [userId]);
    return result.insertId;
  }
}

module.exports = Admin;