const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js"); // Importa el pool como en tu ejemplo
const { deleteSkill } = require("../../Routes/skillsRoutes.js"); // Ruta esperada: /skills/:idSkill
// const passport = require("passport"); // Descomenta si usas autenticación JWT

router.delete(
  deleteSkill,
  // passport.authenticate("jwt", { session: false }), // Descomenta si usas auth
  async (req, res) => {
    const idSkill = req.params.idSkill;

    if (!idSkill) {
      return res.status(400).json({
        success: false,
        mensaje: "El id de la habilidad es requerido",
      });
    }

    try {
      const [result] = await mysqlDB.conexionDB.execute(
        "DELETE FROM skills WHERE idSkills = ?",
        [idSkill]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          mensaje: "No se encontró la habilidad con ese id",
        });
      }

      res.status(200).json({
        success: true,
        mensaje: "Habilidad eliminada correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: "Error al eliminar la habilidad",
        error: error.message,
        detalles: error.stack,
      });
    }
  }
);

module.exports = router;
