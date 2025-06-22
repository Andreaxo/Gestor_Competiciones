// Imports de framework y modulos MySQL
const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
const passport = require("passport");
const { deleteCompetitions } = require("../../Routes/competitionsRoutes.js");

router.use(cors());

// Delete de notas
router.delete(
  deleteCompetitions,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.params.idCompetition;

    try {
      // Usar directamente el pool para ejecutar la consulta
      await mysqlDB.conexionDB.execute(
        "DELETE FROM competitions WHERE idCompetitions = ?",
        [id]
      );

      res.json({
        success: true,
        message: "Competición eliminada correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar la competición:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar la competición",
        error: error.message,
      });
    }
  }
);

module.exports = router;
