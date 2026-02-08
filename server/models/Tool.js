const pool = require('../config/db');

class Tool {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM tools');
    return rows;
  }
}

module.exports = Tool;