const OrderService = require('../services/order.service');

const OrderController = {
    async createOrder(req, res, next){
        try {
            const result = await OrderService.createOrder(req.body);
            res.status(201).json({ message: 'Order created successfully', result });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = OrderController;