const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/search', ProductController.getFilteredProducts);

module.exports = router;
