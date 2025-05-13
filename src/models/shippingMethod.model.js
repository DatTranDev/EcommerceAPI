const db = require('../config/db');

const ShippingMethodModel = {
    async getAllShippingMethods() {
        const [rows] = await db.execute('SELECT * FROM ShippingMethod');
        return rows;
    },
    
    async getShippingMethodById(id) {
        const [rows] = await db.execute('SELECT * FROM ShippingMethod WHERE id = ?', [id]);
        return rows[0];
    },
    
    async createShippingMethod(name, cost) {
        const [result] = await db.execute(
        'INSERT INTO ShippingMethod (name, cost) VALUES (?, ?)',
        [name, cost]
        );
        return result.insertId;
    },
    
    async updateShippingMethod(id, name, cost) {
        await db.execute(
        'UPDATE ShippingMethod SET name = ?, cost = ? WHERE id = ?',
        [name, cost, id]
        );
    },
    
    async deleteShippingMethod(id) {
        await db.execute('DELETE FROM ShippingMethod WHERE id = ?', [id]);
    }
};

module.exports = ShippingMethodModel;
