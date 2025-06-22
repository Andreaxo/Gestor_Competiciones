// Imports de framework y modulos MySQL
const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
const passport = require("passport");
const { checkRoles } = require("../../Midleware/auth.handler.js");

// Middleware
router.use(cors());

// Imports de Variables
const { getCompetitions } = require("../../Routes/competitionsRoutes.js");

// Get de competiciones
router.get(getCompetitions, async (req, res) => {
  try {
    // Ejecutar consulta directamente desde el pool
    const [filas] = await mysqlDB.conexionDB.execute("SELECT * FROM competitions");

    res.send(filas);
  } catch (error) {
    console.error("Error al obtener competiciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las competiciones",
      error: error.message
    });
  }
});

module.exports = router;
