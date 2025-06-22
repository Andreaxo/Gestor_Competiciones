const db = require("../../db_connection/mysql");

const table = "usuarios";

function sendForm(body) {
  return db.sendForm(table, body);
}
function getForm() {
  return db.getForm(table);
}

function getFormById(id) {
  return db.getFormById(table, id);
}

function deleteForm(body) {
  return db.deleteForm(table, body);
}

module.exports = {
  getForm,
  getFormById,
  deleteForm,
  sendForm,
};
