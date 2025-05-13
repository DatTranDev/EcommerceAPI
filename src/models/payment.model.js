const db = require('../config/db');

const PaymentModel = {
    async getAllPayments() {
        const [rows] = await db.execute('SELECT * FROM Payment');
        return rows;
    },

    async getPaymentById(id) {
        const [rows] = await db.execute('SELECT * FROM Payment WHERE id = ?', [id]);
        return rows[0];
    },

    async createPayment(method, amount) {
        const [result] = await db.execute(
            'INSERT INTO Payment (method, amount) VALUES (?, ?)',
            [method, amount]
        );
        return result.insertId;
    },

    async updatePaidPayment(id, method, amount) {
        await db.execute(
            'UPDATE Payment SET method = ?, amount = ?, paidAt = current_timestamp WHERE id = ?',
            [method, amount, id]
        );
    }
}

module.exports = PaymentModel;