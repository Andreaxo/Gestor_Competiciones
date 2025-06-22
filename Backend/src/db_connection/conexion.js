// Importar el paquete mysql2
const mysql = require('mysql2/promise');
const config = require('../config');

// Configurar la conexion
const conexionDB = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: true,
    connectionLimit: 10,     // Puedes ajustar este número según tus necesidades
    queueLimit: 0
});

module.exports = { conexionDB }