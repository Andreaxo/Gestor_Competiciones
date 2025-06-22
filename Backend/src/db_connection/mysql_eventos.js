const mysql2 = require("mysql2");
const config = require("../config");

const DBconfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
};

let connection;

function connectionSQL() {
  connection = mysql2.createConnection(DBconfig);

  connection.connect((err) => {
    if (err) {
      setTimeout(connectionSQL, 200);
    } else {
    }
  });

  connection.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      connectionSQL();
    } else {
      throw err;
    }
  });
}

connectionSQL();

// Función para obtener todos los registros de una tabla
function allEvents(table) {
  return connection.promise().query(`SELECT * FROM ${table}`);
}

// Función para obtener un registro específico por ID
function onlyOneEvent(table, id) {
  return connection
    .promise()
    .query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
}

// Función para agregar un nuevo registro a una tabla
function add(table, data) {
  if (data && data.id == 0) {
    return addEvent(table, data);
  }
}

// Función para agregar un nuevo usuario
function addEvent(table, data) {
  return connection.promise().query(`INSERT INTO ${table} SET ?`, data);
}

// Función para actualizar un registro existente
function updateEvent(table, id, data) {
  return connection
    .promise()
    .query(`UPDATE ${table} SET ? WHERE id = ${id}`, [data]);
}

function deleteEvent(table, id) {
  return connection.promise().query(`DELETE FROM ${table} WHERE id = ?`, [id]);
}

module.exports = {
  allEvents,
  onlyOneEvent,
  add,
  addEvent,
  updateEvent,
  deleteEvent,
};
