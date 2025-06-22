const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
const passport = require("passport");

router.use(cors());

// Import de variables de ruta
const { getDocumentbyIdSkill } = require("../../Routes/documentsRoutes.js");

router.get(
  getDocumentbyIdSkill,
  // passport.authenticate("jwt", { session: false }), // Descomenta si quieres usar auth
  async (req, res) => {
    const idSkill = req.params.idSkill;

    try {
      // Usamos directamente el pool para ejecutar la consulta
      const [filas] = await mysqlDB.conexionDB.execute(
        "SELECT * FROM documents WHERE skillId = ?",
        [idSkill]
      );

      res.json(filas);
    } catch (error) {
      res.status(500).json({
        mensaje: error.message,
        detalles: error.stack,
      });
    }
  }
);

module.exports = router;
