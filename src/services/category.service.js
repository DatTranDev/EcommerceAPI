const db = require('../config/db');
const CategoryModel = require('../models/category.model');
const { NotFoundError } = require('../utils/AppError');

const CategoryService = {
    async getAllCategories() {
        const categories = await CategoryModel.getAllCategories();
        return categories;
    },
    
    async getCategoryById(id) {
        const category = await CategoryModel.getCategoryById(id);
        if (!category) {
        throw new NotFoundError(`Category with ID ${id} not found`);
        }
        return category;
    },
};

module.exports = CategoryService;
