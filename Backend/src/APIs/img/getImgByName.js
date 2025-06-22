const express = require("express");
const router = express.Router();
const path = require("path");
// const passport = require("passport"); // Descomenta si usas autenticación

const { getImgByFileName } = require("../../Routes/imgRoutes.js");

// Nota: No uses cors() aquí, debe ir en el archivo principal de la app

router.get(getImgByFileName, async (req, res) => {
  try {
    const fileName = req.params.fileName;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        mensaje: "Se requiere el nombre del archivo",
      });
    }

    // Construir ruta absoluta al archivo
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "assets",
      "img",
      "competitionsImg",
      fileName
    );

    // Enviar el archivo con manejo de errores
    res.sendFile(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          // Archivo no encontrado
          return res.status(404).json({
            success: false,
            mensaje: "Imagen no encontrada",
            fileName,
          });
        }
        // Otro error al enviar archivo
        return res.status(500).json({
          success: false,
          mensaje: "Error al enviar la imagen",
          error: err.message,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
      error: error.message,
      detalles: error.stack,
    });
  }
});

module.exports = router;
