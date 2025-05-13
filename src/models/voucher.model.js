const db = require('../config/db');

const VoucherModel = {
    async getVoucherByCode(code) {
        const [rows] = await db.execute('SELECT * FROM Voucher WHERE code = ?', [code]);
        return rows[0];
    }
};

module.exports = VoucherModel;