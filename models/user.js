const db = require('../util/database');

module.exports = class User {
    constructor(id, firstName, lastName, email, password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }

    async save() {
        return db.execute(
            'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)', 
            [this.firstName, this.lastName, this.email, this.password]
        );
    }

    static setToken(token, resetTokenExpiration, email) {
        return db.execute(
            'UPDATE users SET `resetToken` = ?, `resetTokenExpiration` = ? WHERE (`email` = ?)',
            [token, resetTokenExpiration, email]
        );
    }
    
    static findbyResetToken(resetToken) {
        return db.execute(
            'SELECT * FROM users WHERE `resetToken` = ?',
            [resetToken]
        );
    }

    /* static findbyTokenandId(resetToken, userId) {
        return db.execute(
            'SELECT * FROM users WHERE `resetToken` = ?, `id` = ?',
            [resetToken, userId]
        );
    } */

    static saveNewPassword(newPassword, resetToken, resetTokenExpiration, userId) {
        return db.execute(
            'UPDATE users SET `password` = ?, `resetToken` = ?, `resetTokenExpiration` = ? WHERE (`id` = ?)',
            [newPassword, resetToken, resetTokenExpiration, userId]
        );
    }


    static findByEmail(email) {
        return db.execute('SELECT * FROM users WHERE users.email = ?', [email]);
    }
}

/* const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

module.exports = User;  */