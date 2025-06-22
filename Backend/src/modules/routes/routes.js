const express = require("express");
const response = require("../../network/responses");
const router = express.Router();
const controller = require("../clientes/controller");
const bcrypt = require("bcryptjs");
const { validateCreate } = require("../validator/validateCreate");

// Asignación de rutas
router.get("/", all); // Obtener todos los clientes
router.get("/:id", onlyOne); // Obtener un cliente por ID
router.post("/", validateCreate, add); // Añadir un cliente
router.put("/:id", validateCreate, updateUser); // Actualizar clientes
router.delete("/:id", deleteAll); // Eliminar todos los clientes

async function all(req, res, next) {
  try {
    const users = await controller.all();

    const sanitizedUsers = users.map((u) => {
      delete u.password;
      return u;
    });

    response.success(req, res, sanitizedUsers, 200);
  } catch (error) {
    next(error);
  }
}

async function onlyOne(req, res, next) {
  try {
    const items = await controller.onlyOne(req.params.id);
    delete items.password;
    response.success(req, res, items, 200);
  } catch (error) {
    next(error);
  }
}

async function add(req, res, next) {
  try {
    let message;
    if (req.body.documentNumber && req.body.id == 0) {
      req.body.password = await bcrypt.hash(req.body.documentNumber, 10);
      message = "Usuario creado con exito, y documento hasheado";
      const items = await controller.add(req.body);
    }
    response.success(req, res, message, 201);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    // Validar que el id sea un número válido
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new Error("ID inválido");
    }

    // Pasar tanto el id como el body al controlador
    const item = await controller.updateUser(id, req.body);

    response.success(req, res, item, 200);
  } catch (error) {
    next(error);
  }
}

// Eliminar todos los clientes
async function deleteAll(req, res, next) {
  try {
    const item = await controller.deleteAll(req.params.id);
    response.success(req, res, item, 200);
  } catch (error) {
    next(error);
  }
}

module.exports = router;
