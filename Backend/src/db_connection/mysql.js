const mysql2 = require("mysql2");
const config = require("../config");
const bcrypt = require("bcryptjs");

// Configuración de la base de datos
const DBconfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
};

let connection;

// Función para conectar a la base de datos
function connectionMYSQL() {
  connection = mysql2.createConnection(DBconfig);

  connection.connect((err) => {
    if (err) {
      setTimeout(connectionMYSQL, 200);
    } else {
    }
  });

  connection.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      connectionMYSQL();
    } else {
      throw err;
    }
  });
}

connectionMYSQL();

// Función para obtener todos los registros de una tabla
function all(table) {
  return connection.promise().query(`SELECT * FROM ${table}`);
}

// Función para obtener un registro específico por ID
function onlyOne(table, id) {
  return connection
    .promise()
    .query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
}

// Función para obtener un registro específico por email
// Esta función se utiliza para verificar si el correo electrónico ya existe en la base de datos
function findByEmail(table, email) {
  return connection
    .promise()
    .query(`SELECT * FROM ${table} WHERE email = ? LIMIT 1`, [email]);
}
// Función para agregar un nuevo registro a una tabla
function add(table, data) {
  if (data && data.id == 0) {
    return addUser(table, data);
  }
}

// Función para agregar un nuevo usuario
function addUser(table, data) {
  return connection.promise().query(`INSERT INTO ${table} SET ?`, data);
}

function updateUser(table, id, data) {
  return connection
    .promise()
    .query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id]);
}

function deleteAll(table, id) {
  return connection.promise().query(`DELETE FROM ${table} WHERE id = ?`, [id]);
}

function uploadProfilePhoto(table, data) {
  return connection.promise().query(
    `INSERT INTO ${table} (id, photo_url) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE photo_url = VALUES(photo_url)`,
    [data.id, data.photo_url]
  );
}

async function updateUserPasswordByEmail(email, hashedPassword) {
  const sql = "UPDATE usuarios SET password = ? WHERE email = ?";
  const [result] = await connection
    .promise()
    .execute(sql, [hashedPassword, email]);
  return result.affectedRows > 0;
}

function sendForm(table, data) {
  if (!data.id) {
    return insert(table, data);
  } else {
    return updateForm(table, data);
  }
}
async function loginUser(table, { email, password }) {
  // 1) Traer usuario
  const [rows] = await connection
    .promise()
    .query(`SELECT * FROM ${table} WHERE email = ? LIMIT 1`, [email]);

  if (rows.length === 0) {
    const err = new Error("USER_NOT_FOUND");
    err.code = "USER_NOT_FOUND";
    throw err;
  }

  const user = rows[0];
  // 2) Comparar contraseña contra el hash en user.password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("INVALID_CREDENTIALS");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // 3) Limpiar el campo sensible y devolver
  delete user.password;
  return user;
}

function insert(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO ${table} 
            (name, lastname, password, rol, phone, documentType, documentNumber, email, birthdate, indexCourse, programName, formationCenter, competitionName, strategyCompetition) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.lastname,
        data.password,
        data.rol,
        data.phone,
        data.documentType,
        data.documentNumber,
        data.email,
        data.birthdate,
        data.indexCourse,
        data.programName,
        data.formationCenter,
        data.skill,
        data.competition,
      ],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function updateForm(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(
      `UPDATE ${table} SET ? WHERE id = ?`,
      [data, data.id],
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function getForm(table) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table}`, (error, result) => {
      return error ? reject(error) : resolve(result);
    });
  });
}

function getFormById(table, id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} WHERE id = ${id}`,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

function deleteForm(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(
      `DELETE FROM ${table} WHERE id = ?`,
      data.id,
      (error, result) => {
        return error ? reject(error) : resolve(result);
      }
    );
  });
}

// Exportar las funciones para su uso en otras partes del proyecto
module.exports = {
  /* Modulo usuarios */
  all,
  onlyOne,
  add,
  updateUser,
  deleteAll,
  uploadProfilePhoto,
  /* Modulo formulario */
  sendForm,
  getForm,
  getFormById,
  updateForm,
  deleteForm,
  loginUser,
  findByEmail,
  updateUserPasswordByEmail,
};
