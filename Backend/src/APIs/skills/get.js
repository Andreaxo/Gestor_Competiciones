const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js");
const { getSkills } = require("../../Routes/skillsRoutes.js"); // Ruta: /skills/:idCompetition

router.get(getSkills, async (req, res) => {
  const idCompetition = req.params.idCompetition;

  if (!idCompetition) {
    return res.status(400).json({
      success: false,
      mensaje: "El id de la competición es requerido",
    });
  }

  try {
    const [filas] = await mysqlDB.conexionDB.execute(
      "SELECT * FROM skills WHERE idCompetition = ?",
      [idCompetition]
    );

    res.status(200).json({
      success: true,
      data: filas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener las habilidades",
      error: error.message,
      detalles: error.stack,
    });
  }
});

module.exports = router;
