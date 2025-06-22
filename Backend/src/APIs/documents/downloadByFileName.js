const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const { downloadByFileName } = require("../../Routes/documentsRoutes.js");

// GET para descargar archivos por nombre
router.get(
  downloadByFileName,
  // passport.authenticate("jwt", { session: false }), // Activa si necesitas autenticación
  async (req, res) => {
    try {
      const fileName = req.params.fileName;

      if (!fileName) {
        return res.status(400).json({
          success: false,
          mensaje: "El nombre del archivo es requerido",
          data: null,
        });
      }

      const filePath = path.join(__dirname, "..", "..", "documents", fileName);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          mensaje: "Archivo no encontrado",
          data: { fileName, searchPath: filePath },
        });
      }

      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        return res.status(400).json({
          success: false,
          mensaje: "La ruta especificada no corresponde a un archivo válido",
          data: null,
        });
      }

      // Extraer el nombre original, quitando el timestamp o prefijo si existe
      const dashIndex = fileName.indexOf("-");
      const originalName =
        dashIndex !== -1 ? fileName.substring(dashIndex + 1) : fileName;

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${originalName}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      res.sendFile(filePath, (err) => {
        if (err) {
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              mensaje: "Error al descargar el archivo",
              error: err.message,
              detalles: err.stack,
            });
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        mensaje: "Error interno del servidor al procesar la descarga",
        error: error.message,
        detalles: error.stack,
      });
    }
  }
);

module.exports = router;
