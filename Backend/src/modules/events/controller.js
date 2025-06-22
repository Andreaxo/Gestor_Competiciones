const db = require('../../db_connection/mysql_eventos');


// Desde acá se llama las tablas que se requieren manejar, y 
// no estar reescribiendo las consultas.

const tabla = 'eventos';

function allEvents () {
    return db.allEvents(tabla);
}

function onlyOneEvent(id){
    return db.onlyOneEvent(tabla, id);
}

function deleteEvent(id) {
    return db.deleteEvent(tabla, id);
}

function addEvent(body){
    return db.addEvent(tabla, body);
}

function updateEvent(id, body){
    return db.updateEvent(tabla,id, body);
}


module.exports = {
    allEvents,
    onlyOneEvent,
    deleteEvent,
    addEvent,
    updateEvent
}