const pool = require('../config/db');

class Mentor {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM mentors');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM mentors WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(name, bio, rating, image_url, specialty) {
    const [result] = await pool.execute(
      'INSERT INTO mentors (name, bio, rating, image_url, specialty) VALUES (?, ?, ?, ?, ?)',
      [name, bio, rating, image_url, specialty]
    );
    return result.insertId;
  }

  static async update(id, name, bio, rating, image_url, specialty) {
    await pool.execute(
      'UPDATE mentors SET name = ?, bio = ?, rating = ?, image_url = ?, specialty = ? WHERE id = ?',
      [name, bio, rating, image_url, specialty, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM mentors WHERE id = ?', [id]);
  }
}

module.exports = Mentor;