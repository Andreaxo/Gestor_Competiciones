const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js"); // Importa el pool directamente

// Importa la ruta para crear habilidad
const { createSkill } = require("../../Routes/skillsRoutes.js");

// POST /skills/:idCompetition
router.post(createSkill, async (req, res) => {
  const idCompetition = req.params.idCompetition;

  // Validar parámetro de ruta
  if (!idCompetition) {
    return res.status(400).json({
      success: false,
      mensaje: "El parámetro idCompetition es obligatorio.",
    });
  }

  const { skillName, competitionName, numberOfCompetitors, description } = req.body;

  // Validar campos obligatorios
  if (!skillName || !competitionName || !numberOfCompetitors || !description) {
    return res.status(400).json({
      success: false,
      mensaje:
        "Todos los campos skillName, competitionName, numberOfCompetitors y description son obligatorios.",
    });
  }

  try {
    await mysqlDB.conexionDB.execute(
      `INSERT INTO skills (skillName, competitionName, numberOfCompetitors, description, idCompetition) VALUES (?, ?, ?, ?, ?)`,
      [skillName, competitionName, numberOfCompetitors, description, idCompetition]
    );

    res.status(201).json({
      success: true,
      mensaje: "Nueva habilidad agregada exitosamente.",
      data: {
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
      mensaje: "Error al crear la habilidad.",
      error: error.message,
      detalles: error.stack,
    });
  }
});

module.exports = router;
