const ProductService = require('../services/product.service');

const ProductController = {
    async getProductsByCategory (req, res, next) {
        try {
            const { categoryId } = req.params;
            const products = await ProductService.getProductsByCategoryId(categoryId);
            res.status(200).json({ success: true, data: products });
        } catch (err) {
            next(err);
        }
    },

    async getFilteredProducts(req, res, next)  {
        try {
            const filters = req.query;
            const products = await ProductService.getFilteredProducts(filters);
            res.json(products);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ProductController
