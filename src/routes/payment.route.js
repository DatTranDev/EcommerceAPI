const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

router.patch('/paid/:id', PaymentController.updatePaidPayment);

module.exports = router;