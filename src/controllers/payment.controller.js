const PaymentService = require('../services/payment.service');

const PaymentController = {
    async updatePaidPayment(req, res, next) {
        try {
            const { id } = req.params;
            const { method, amount } = req.body;

            await PaymentService.updatePaidPayment(id, method, amount);
            res.status(200).json({ message: 'Payment updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = PaymentController;