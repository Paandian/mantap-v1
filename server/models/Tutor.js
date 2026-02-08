const pool = require('../config/db');

class Tutor {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM tutors');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM tutors WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(name, bio, rating, image_url, verification_status) {
    const [result] = await pool.execute(
      'INSERT INTO tutors (name, bio, rating, image_url, verification_status) VALUES (?, ?, ?, ?, ?)',
      [name, bio, rating, image_url, verification_status]
    );
    return result.insertId;
  }

  static async update(id, name, bio, rating, image_url, verification_status) {
    await pool.execute(
      'UPDATE tutors SET name = ?, bio = ?, rating = ?, image_url = ?, verification_status = ? WHERE id = ?',
      [name, bio, rating, image_url, verification_status, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM tutors WHERE id = ?', [id]);
  }
}

module.exports = Tutor;