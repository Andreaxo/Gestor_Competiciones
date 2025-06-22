const db = require('../../db_connection/mysql');

const table = 'usuarios';

async function sendUser(body) {
  const [rows] = await db.loginUser(table, body);
  if (rows.length > 0) {
    return "Acceso exitoso";
  } else {
    return "Acceso denegado";
  }
}

module.exports = {
    sendUser
}