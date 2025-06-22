const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js");

const { updateSkill } = require("../../Routes/skillsRoutes.js");

// PUT /skills/:idSkill
router.put(updateSkill, async (req, res) => {
  const id = req.params.idSkill;

  // Validar que idSkill esté presente
  if (!id) {
    return res.status(400).json({
      success: false,
      mensaje: "El parámetro idSkill es obligatorio.",
    });
  }

  const {
    skillName,
    competitionName,
    numberOfCompetitors,
    description,
    idCompetition,
  } = req.body;

  // Validar campos obligatorios
  if (
    !skillName ||
    !competitionName ||
    numberOfCompetitors === undefined ||
    !description ||
    !idCompetition
  ) {
    return res.status(400).json({
      success: false,
      mensaje:
        "Todos los campos skillName, competitionName, numberOfCompetitors, description y idCompetition son obligatorios.",
    });
  }

  try {
    const [result] = await mysqlDB.conexionDB.execute(
      `UPDATE skills 
       SET skillName = ?, competitionName = ?, numberOfCompetitors = ?, description = ?, idCompetition = ? 
       WHERE idSkills = ?`,
      [skillName, competitionName, numberOfCompetitors, description, idCompetition, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        mensaje: "No se encontró la habilidad con ese id para actualizar.",
      });
    }

    res.status(200).json({
      success: true,
      mensaje: "Habilidad modificada exitosamente",
      data: {
        idSkill: id,
        skillName,
        competitionName,
        numberOfCompetitors,
        description,
        idCompetition,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al modificar la habilidad",
      error: error.message,
      detalles: error.stack,
    });
  }
});

module.exports = router;
