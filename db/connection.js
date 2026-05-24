const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión con MySQL.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'test',
    password: process.env.DB_PASSWORD ?? 'test',
    database: process.env.DB_NAME || 'gestion_citas',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();

