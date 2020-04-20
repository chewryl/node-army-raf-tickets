
const mysql = require('mysql2');

const pool = mysql.createPool({ //host?
    host: 'eu-cdbr-west-03.cleardb.net',
    user: process.env.SQL_USER,
    database: process.env.SQL_DEFAULT_DATABASE,
    password: process.env.SQL_PASSWORD
});

module.exports = pool.promise();    // can use promises when working with the connections - to handle asynchronous code

