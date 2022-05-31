const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'crud_blog',
    user: 'root',
    password: ''
});

module.exports = pool;