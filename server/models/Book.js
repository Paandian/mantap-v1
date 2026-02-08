const pool = require('../config/db');

class Book {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM books');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(title, publisher, verified_status, rating, description, price, image_url) {
    const [result] = await pool.execute(
      'INSERT INTO books (title, publisher, verified_status, rating, description, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, publisher, verified_status, rating, description, price, image_url]
    );
    return result.insertId;
  }

  static async update(id, title, publisher, verified_status, rating, description, price, image_url) {
    await pool.execute(
      'UPDATE books SET title = ?, publisher = ?, verified_status = ?, rating = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
      [title, publisher, verified_status, rating, description, price, image_url, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM books WHERE id = ?', [id]);
  }
}

module.exports = Book;