const db = require('../config/db');

const UserModel = {
  async createUser({ name, email, password, phone, isAdmin = false }) {
    const [result] = await db.execute(
      `INSERT INTO User (name, email, password, phone, isAdmin) VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, phone, isAdmin]
    );
    return result.insertId;
  },

  async getUserByEmail(email) {
    const [rows] = await db.execute(
      `SELECT * FROM User WHERE email = ?`,
      [email]
    );
    return rows[0];
  },

  async getUserById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM User WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
};

module.exports = UserModel;
