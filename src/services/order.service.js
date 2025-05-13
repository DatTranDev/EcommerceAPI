const db = require('../config/db');
const emailUtil = require('../utils/Email.util');
const PaymentService = require('./payment.service');
const PaymentMethodService = require('./paymentMethod.service');
const VoucherService = require('./voucher.service');
const ShippingMethodService = require('./shippingMethod.service');

const OrderService = {
    async createOrder(orderData) {
        const {
            userId,
            shippingMethodId,
            paymentMethodId,
            shippingAddressId,
            statusId,
            items,
            voucherIds = []
        } = orderData;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Tính tổng giá trị sản phẩm
            const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

            // Lấy phí ship
            const [[shippingRow]] = await ShippingMethodService.getShippingMethodById(shippingMethodId);
            const shippingFee = shippingRow?.price || 0;

            // Lấy thông tin phương thức thanh toán
            const [[paymentMethod]] = await PaymentMethodService.getPaymentMethodById(paymentMethodId);
            const methodName = paymentMethod.name;

            // Lấy thông tin các voucher hợp lệ
            const vouchers = await VoucherService.getValidVouchers(voucherIds);

            // Tính tổng giảm giá
            const discount = VoucherService.calculateDiscount(vouchers, subtotal, shippingFee);

            // Tổng cộng = sản phẩm + ship - giảm
            const total = Math.max(subtotal + shippingFee - discount, 0);

            const paymentId = await PaymentService.createPayment(paymentMethodId, total);

            // Tạo đơn hàng
            const [orderResult] = await connection.execute(
                `INSERT INTO ShopOrder 
                (userId, statusId, shippingMethodId, paymentId, shippingAddressId, total)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, statusId, shippingMethodId, paymentId, shippingAddressId, total]
            );
            const orderId = orderResult.insertId;

            // Tạo từng OrderItem
            for (const item of items) {
                await connection.execute(
                    `INSERT INTO OrderItem (orderId, productItemId, quantity, storeId, price)
                    VALUES (?, ?, ?, ?, ?)`,
                    [orderId, item.productItemId, item.quantity, item.storeId, item.price]
                );
            }

            // Ghi ApplyVoucher và giảm số lượng voucher(sẵn trigger)
            for (const voucher of vouchers) {
                await connection.execute(
                    'INSERT INTO ApplyVoucher (orderId, voucherId) VALUES (?, ?)',
                    [orderId, voucher.id]
                );
            }

            await connection.commit();

            // Gửi email xác nhận bất đồng bộ
            setImmediate(async () => {
                const [[user]] = await connection.execute(
                    'SELECT email, name FROM User WHERE id = ?',
                    [userId]
                );
                if (user) {
                    await emailUtil.sendOrderConfirmation(user.email, {
                        name: user.name,
                        orderId,
                        total
                    });
                }
            });

            return { orderId, total, discount, shippingFee };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
};

module.exports = OrderService;
