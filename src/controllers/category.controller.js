const CategoryService = require('../services/category.service');
const { NotFoundError } = require('../utils/AppError');

const CategoryController = {
  async getAllCategories(req, res, next){
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (err) {
      next(err); 
    }
  }
}

module.exports = CategoryController;
