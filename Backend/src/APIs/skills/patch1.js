const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js"); // Asegúrate de que este exporta { conexionDB }
const { patchSkill1 } = require("../../Routes/skillsRoutes.js"); // Ruta: /skills/patch2/:idSkill
// const passport = require("passport"); // Descomenta si usas autenticación

router.patch(
  patchSkill1,
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const idSkill = req.params.idSkill;
    const { idCompetidor } = req.body;

    if (!idSkill) {
      return res.status(400).json({
        success: false,
        mensaje: "El idSkill es obligatorio",
      });
    }

    try {
      // Si idCompetidor es null, lo eliminamos
      const updateQuery = idCompetidor
        ? "UPDATE skills SET comp1 = ? WHERE idSkills = ?"
        : "UPDATE skills SET comp1 = NULL WHERE idSkills = ?";

   const [result] = idCompetidor
     ? await mysqlDB.conexionDB.execute(updateQuery, [idCompetidor, idSkill])
     : await mysqlDB.conexionDB.execute(updateQuery, [idSkill]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          mensaje: "Habilidad no encontrada o sin cambios",
        });
      }

      const mensaje = idCompetidor
        ? "Primer competidor asignado correctamente"
        : "Primer competidor eliminado correctamente";

      res.status(200).json({
        success: true,
        mensaje,
        data: {
          idSkill,
          idCompetidor: idCompetidor || "Eliminado",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: "Error al actualizar el competidor",
        error: error.message,
        detalles: error.stack,
      });
    }
  }
);

module.exports = router;
