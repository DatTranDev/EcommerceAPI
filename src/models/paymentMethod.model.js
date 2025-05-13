const db = require('../config/db');

const PaymentMethodModel = {
    async getPaymentMethodById(id) {
        const [rows] = await db.execute('SELECT * FROM PaymentMethod WHERE id = ?', [id]);
        return rows[0];
    }
}
module.exports = PaymentMethodModel;