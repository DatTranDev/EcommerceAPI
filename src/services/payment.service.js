const PaymentModel = require('../models/payment.model');

const { NotFoundError } = require('../utils/AppError');

const PaymentService = {
    async getAllPayments() {
        const payments = await PaymentModel.getAllPayments();
        return payments;
    },

    async getPaymentById(id) {
        const payment = await PaymentModel.getPaymentById(id);
        if (!payment) {
            throw new NotFoundError(`Payment with ID ${id} not found`);
        }
        return payment;
    },

    async createPayment(method, amount) {
        const id = await PaymentModel.createPayment(method, amount);
        return id;
    },

    async updatePaidPayment(id, method, amount) {
        const payment = await PaymentModel.getPaymentById(id);
        if (!payment) {
            throw new NotFoundError(`Payment with ID ${id} not found`);
        }
        await PaymentModel.updatePaidPayment(id, method, amount);
    },
};
module.exports = PaymentService;