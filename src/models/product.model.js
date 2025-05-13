const db = require('../config/db');

const ProductModel = {
  async createProduct({ name, describes, model, original }) {
    const [result] = await db.execute(
      `INSERT INTO Product (name, describes, model, original) VALUES (?, ?, ?, ?)`,
      [name, describes, model, original]
    );
    return result.insertId;
  },

  async getProductById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM Product WHERE id = ? AND isDeleted = FALSE`,
      [id]
    );
    return rows[0];
  },
  async getProductsByCategoryId(categoryId) {
    const [rows] = await db.execute(
      `
      SELECT p.* 
      FROM Product p
      JOIN ProductCategory pc ON p.id = pc.productId
      WHERE pc.categoryId = ? AND p.isDeleted = false
      `,
      [categoryId]
    );
    return rows;
  },

  async getAllProducts() {
    const [rows] = await db.execute(`SELECT * FROM Product WHERE isDeleted = FALSE`);
    return rows;
  },
  async runQuery(query, params) {
    const [rows] = await db.execute(query, params);
    return rows;
  }
};

module.exports = ProductModel;
