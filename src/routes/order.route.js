const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');

router.post('/', OrderController.createOrder);

module.exports = router;
