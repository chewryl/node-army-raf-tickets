const db = require('../util/database');

module.exports = class Ticket {
  static fetchAll() {
    return db.execute('SELECT * FROM tickets');
  }

  static fetchOne(id) {
    return db.execute('SELECT * FROM tickets WHERE id = ?', [id]);
  }
  
};