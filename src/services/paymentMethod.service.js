const PaymentMethodModel = require('../models/paymentMethod.model');
const { NotFoundError } = require('../utils/AppError');

const PaymentMethodService = {
    async getPaymentMethodById(id) {
        const paymentMethod = await PaymentMethodModel.getPaymentMethodById(id);
        if (!paymentMethod) {
            throw new NotFoundError(`Payment method with ID ${id} not found`);
        }
        return paymentMethod;
    },
}
module.exports = PaymentMethodService;