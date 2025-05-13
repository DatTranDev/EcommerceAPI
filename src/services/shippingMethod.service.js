const ShippingMethodModel = require('../models/shippingMethod.model');
const { NotFoundError } = require('../utils/AppError');

const ShippingMethodService = {
    async getAllShippingMethods() {
        const shippingMethods = await ShippingMethodModel.getAllShippingMethods();
        return shippingMethods;
    },

    async getShippingMethodById(id) {
        const shippingMethod = await ShippingMethodModel.getShippingMethodById(id);
        if (!shippingMethod) {
            throw new NotFoundError(`Shipping method with ID ${id} not found`);
        }
        return shippingMethod;
    },

    async createShippingMethod(name, cost) {
        const id = await ShippingMethodModel.createShippingMethod(name, cost);
        return id;
    },

    async updateShippingMethod(id, name, cost) {
        await ShippingMethodModel.updateShippingMethod(id, name, cost);
    },

    async deleteShippingMethod(id) {
        await ShippingMethodModel.deleteShippingMethod(id);
    }
};

module.exports = ShippingMethodService;