const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js"); // Usa conexionDB del pool configurado
const { getbyIdSkill } = require("../../Routes/skillsRoutes.js"); // Ruta: /skills/:idSkill

router.get(getbyIdSkill, async (req, res) => {
  const idSkill = req.params.idSkill;

  if (!idSkill) {
    return res.status(400).json({
      success: false,
      mensaje: "El id de la habilidad es requerido",
    });
  }

  try {
    const [filas] = await mysqlDB.conexionDB.execute(
      "SELECT * FROM skills WHERE idSkills = ?",
      [idSkill]
    );

    if (filas.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "Habilidad no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: filas[0], // Solo un registro esperado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al obtener la habilidad",
      error: error.message,
      detalles: error.stack,
    });
  }
});

module.exports = router;
