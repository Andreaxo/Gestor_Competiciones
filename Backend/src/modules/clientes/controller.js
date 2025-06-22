const db = require('../../db_connection/mysql');


// Desde acá se llama las tablas que se requieren manejar, y 
// no estar reescribiendo las consultas.

const tabla = 'usuarios';

async function all() {
    const [rows] = await db.all(tabla); 
    return rows;
  }
  
  async function onlyOne(id) {
    const [rows] = await db.onlyOne(tabla, id);
    return rows[0] || null;
  }

  async function findByEmail(email) {
    const [rows] = await db.findByEmail(tabla, email);
    return rows.length > 0 ? rows[0] : null;
  }


function deleteAll(id) {
    return db.deleteAll(tabla, id);
}

function add(body){
    return db.add(tabla, body);
}

function updateUser(id, body){
    return db.updateUser(tabla,id, body);
}

function uploadProfilePhoto(body){
    return db.uploadProfilePhoto(tabla,body);
}

// function getProfilePhoto(id){
//     return db.getProfilePhoto(tabla,id);
// }


module.exports = {
    all,
    onlyOne,
    deleteAll,
    add,
    updateUser,
    uploadProfilePhoto,
    findByEmail
}