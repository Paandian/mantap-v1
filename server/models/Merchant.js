const pool = require('../config/db');

class Merchant {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM merchants');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM merchants WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(name, description, verified_status, rating, price, image_url) {
    const [result] = await pool.execute(
      'INSERT INTO merchants (name, description, verified_status, rating, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, verified_status, rating, price, image_url]
    );
    return result.insertId;
  }

  static async update(id, name, description, verified_status, rating, price, image_url) {
    await pool.execute(
      'UPDATE merchants SET name = ?, description = ?, verified_status = ?, rating = ?, price = ?, image_url = ? WHERE id = ?',
      [name, description, verified_status, rating, price, image_url, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM merchants WHERE id = ?', [id]);
  }
}

module.exports = Merchant;