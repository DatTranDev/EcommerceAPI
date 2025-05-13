const ProductModel = require('../models/product.model');

const CategoryService = require('./category.service');

const { NotFoundError } = require('../utils/AppError');

const ProductService = {

  async getProductsByCategoryId(categoryId) {
    await CategoryService.getCategoryById(categoryId);

    const products = await ProductModel.getProductsByCategoryId(categoryId);
    return products;
  },
  async getFilteredProducts(filters) {
  const {
    keyword,
    categoryId,
    minPrice,
    maxPrice,
  } = filters;

  // Base query
  let query = `
    SELECT DISTINCT p.*
    FROM Product p
    LEFT JOIN ProductCategory pc ON p.id = pc.productId
    WHERE p.isDeleted = false
  `;
  const params = [];

  if (keyword) {
    query += ` AND (p.name LIKE ? OR p.describes LIKE ?) `;
    const likeKeyword = `%${keyword}%`;
    params.push(likeKeyword, likeKeyword);
  }

  if (categoryId) {
    query += ` AND pc.categoryId = ? `;
    params.push(categoryId);
  }

  if (minPrice || maxPrice) {
    query += `
      AND EXISTS (
        SELECT 1 FROM ProductItem pi
        WHERE pi.productId = p.id
    `;
    if (minPrice) {
      query += ` AND pi.price >= ? `;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND pi.price <= ? `;
      params.push(maxPrice);
    }
    query += ` ) `;
  }

  const products = await ProductModel.runQuery(query, params);
  return products;
}
};

module.exports = ProductService;
