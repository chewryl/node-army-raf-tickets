const db = require('../util/database');

module.exports = class OrderItem {
    constructor(id, quantity, orderId, ticketId) {
        this.id = id;
        this.quantity = quantity;
        this.orderId = orderId;
        this.ticketId = ticketId
    }

    static async getOrderItems(orderId) {
        return db.execute('SELECT * FROM orderItems WHERE orderId = ?', [orderId]);
    }
    

}
