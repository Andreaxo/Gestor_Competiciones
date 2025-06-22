// Imports de framework y modulos MySQL
const express = require("express");
const router = express.Router();
const passport = require("passport");
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
const { getCompetitionsById } = require("../../Routes/competitionsRoutes.js");

// Middleware
router.use(cors());

// Get de competiciones por id
router.get(
  getCompetitionsById,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.params.idCompetition;

    try {
      // Ejecutar consulta directamente con el pool
      const [filas] = await mysqlDB.conexionDB.execute(
        "SELECT * FROM competitions WHERE idCompetitions = ?",
        [id]
      );

      res.send(filas);
    } catch (error) {
      res.status(500).send({
        mensaje: "Error al obtener la competición",
        detalles: error.message,
      });
    }
  }
);

module.exports = router;
