const express = require("express");
const router = express.Router();
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const passport = require("passport");
const mysqlDB = require("../../db_connection/conexion.js");
const { deleteByFileName } = require("../../Routes/documentsRoutes.js");

router.use(cors());

// Ruta para eliminar archivo por nombre
router.delete(
  deleteByFileName,
  //passport.authenticate("jwt", { session: false }), // Descomenta si necesitas autenticación
  async (req, res) => {
    try {
      const fileName = req.params.fileName;
      const filePath = path.join(__dirname, "..", "..", "documents", fileName);

      // Ejecutar query con el pool directamente
      await mysqlDB.conexionDB.execute(
        "DELETE FROM documents WHERE fileName = ?",
        [fileName]
      );

      // Eliminar archivo del sistema de archivos
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({
            mensaje: "Error al eliminar el archivo",
            detalles: err.message,
          });
        }

        res.status(200).json({
          mensaje: "Archivo eliminado exitosamente",
        });
      });
    } catch (error) {
      res.status(500).json({
        mensaje: "Error interno en el servidor",
        detalles: error.message,
      });
    }
  }
);

module.exports = router;
