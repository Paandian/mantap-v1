const pool = require('../config/db');

class School {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM schools');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM schools WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(name, location, claimed_status, rating, image_url) {
    const [result] = await pool.execute(
      'INSERT INTO schools (name, location, claimed_status, rating, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, location, claimed_status, rating, image_url]
    );
    return result.insertId;
  }

  static async update(id, name, location, claimed_status, rating, image_url) {
    await pool.execute(
      'UPDATE schools SET name = ?, location = ?, claimed_status = ?, rating = ?, image_url = ? WHERE id = ?',
      [name, location, claimed_status, rating, image_url, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM schools WHERE id = ?', [id]);
  }
}

module.exports = School;