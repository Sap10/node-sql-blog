const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'crud_blog',
    user: 'admin',
    password: 'password@123'
});

module.exports = pool;