const pool = require('../config/db');

class Testimonial {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM testimonials');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(name, role, content, image_url) {
    const [result] = await pool.execute(
      'INSERT INTO testimonials (name, role, content, image_url) VALUES (?, ?, ?, ?)',
      [name, role, content, image_url]
    );
    return result.insertId;
  }

  static async update(id, name, role, content, image_url) {
    await pool.execute(
      'UPDATE testimonials SET name = ?, role = ?, content = ?, image_url = ? WHERE id = ?',
      [name, role, content, image_url, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM testimonials WHERE id = ?', [id]);
  }
}

module.exports = Testimonial;