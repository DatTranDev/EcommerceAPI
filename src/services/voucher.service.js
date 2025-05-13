const VoucherModel = require('../models/voucher.model');
const { NotFoundError } = require('../utils/AppError');

const VoucherService = {
    async getValidVouchers(voucherIds) {
    const now = new Date().toISOString().slice(0, 10);

    const [rows] = await db.execute(
        `SELECT * FROM Voucher 
        WHERE id IN (${voucherIds.map(() => '?').join(',')})
        AND isDeleted = false
        AND startDate <= ?
        AND endDate >= ?
        AND quantity > 0`,
        [...voucherIds, now, now]
    );

        return rows;
    },

    async getVoucherByCode(code) {
        const voucher = await VoucherModel.getVoucherByCode(code);
        if (!voucher) {
            throw new NotFoundError(`Voucher with code ${code} not found`);
        }
        if(voucher.endDate < new Date()) {
            throw new NotFoundError(`Voucher with code ${code} has expired`);
        }
        if(voucher.quantity <= 0) {
            throw new NotFoundError(`Voucher with code ${code} is out of stock`);
        }
        if(voucher.startDate > new Date()) {
            throw new NotFoundError(`Voucher with code ${code} is not yet valid`);
        }
        return voucher;
    },
    calculateDiscount(vouchers, subtotal, shippingFee) {
        const totalBeforeDiscount = subtotal + shippingFee;

        let totalDiscount = 0;

        for (const v of vouchers) {
            if (totalBeforeDiscount < parseFloat(v.minOrderValue)) continue;

            if (v.discountType === 'FIXED') {
                totalDiscount += parseFloat(v.discountValue);
            } else if (v.discountType === 'PERCENT') {
                let percentValue = totalBeforeDiscount * parseFloat(v.discountValue) / 100;
                if (v.maxDiscountValue) {
                    percentValue = Math.min(percentValue, parseFloat(v.maxDiscountValue));
                }
                    totalDiscount += percentValue;
            }
        }

        return Math.min(totalDiscount, totalBeforeDiscount); 
  }
};
module.exports = VoucherService;