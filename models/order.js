const db = require('../util/database');

module.exports = class Order {
    constructor(id, userId, addressId) {
        this.id = id;
        this.userId = userId;
        this.addressId = addressId;
    }

    static async getOrder(userId) {
        return db.execute('SELECT * FROM orders WHERE userId = ?', [userId]);
    }


}


