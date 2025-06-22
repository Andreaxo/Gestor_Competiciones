const express = require('express');
const response = require('../../network/responses');
const router = express.Router();
const controller = require('../events/controller');


// Asignación de rutas
router.get('/', allEvents); // Obtener todos los clientes
router.get('/:id', onlyOneEvent); // Obtener un cliente por ID
router.post('/', addEvent) // Añadir un cliente
router.put('/:id', updateEvent) // Actualizar clientes
router.delete('/:id', deleteEvent); // Eliminar todos los clientes



// Obtener todos los clientes
async function allEvents(req, res, next) {
    try {
        const items = await controller.allEvents();
        response.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}

// Obtener un cliente por ID
async function onlyOneEvent(req, res, next) {
    try {
        const items = await controller.onlyOneEvent(req.params.id);
        response.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}


async function addEvent(req, res, next) {
    try {
        const { id } = req.body;
        const items = await controller.addEvent(req.body);

        let message = id === 0 ? 'Evento creado con éxito' : 'Evento actualizado con éxito';

        response.success(req, res, message, 201);
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
}


async function updateEvent(req, res, next) {
    try {
        // Validar que el id sea un número válido
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new Error('ID inválido');
        }

        // Pasar tanto el id como el body al controlador
        const item = await controller.updateEvent(id, req.body);
        
        response.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}



// Eliminar todos los clientes
async function deleteEvent(req, res, next) {
    try {
        const item = await controller.deleteEvent(req.params.id);
        response.success(req, res, item, 200);
    } catch (error) {
        next(error);
    }
}




module.exports = router;
