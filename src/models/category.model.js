const db = require('../config/db');

const CategoryModel = {
  async getAllCategories() {
    const [rows] = await db.execute(`SELECT * FROM Category`);
    return rows;
  },

  async createCategory({ name, parentId = null }) {
    const [result] = await db.execute(
      `INSERT INTO Category (name, parentId) VALUES (?, ?)`,
      [name, parentId]
    );
    return result.insertId;
  },

  async getCategoryById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM Category WHERE id = ?`,
      [id]
    );
    return rows[0];
  }
};

module.exports = CategoryModel;
