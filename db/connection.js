const mysql = require('mysql2');

// Configuración de la conexión con MySQL.
const pool = mysql.createPool({
    host: 'localhost',
    user: 'test',      
    password: 'test',
    database: 'gestion_citas',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();