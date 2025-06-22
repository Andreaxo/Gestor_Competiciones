const express = require("express");
const router = express.Router();
const app = express();
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
app.use(cors());
const multer = require("multer");
const passport = require("passport");
const path = require("path"); // Agregar para manejo de rutas
const fs = require("fs"); // Agregar para verificar directorios
const { postByCompetition } = require("../../Routes/documentsRoutes.js");

// Crear directorio si no existe
const documentsDir = path.join(__dirname, "../../documents");
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Configurar la ruta del multer, la key del archivo siempre debe ser pdf.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir); // Usar ruta absoluta
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Opcional: filtrar tipos de archivo
    const allowedTypes = /pdf|doc|docx|jpg|png|xlsx|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, DOC y DOCX'));
    }
  }
});

//Aqui se crea el endpoint
router.post(
  postByCompetition,
  /* passport.authenticate("jwt", { session: false }), */
  upload.single("pdf"),
  async (req, res) => {
    try {
      const conexion = mysqlDB.conexionDB;

      //Obtener fecha en formato SQL
      const getCurrentDateFormatted = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      //Establecer los datos a enviar
      const uploadDate = getCurrentDateFormatted();
      const fileName = req.file ? req.file.filename : null;
      const competitionId = req.params.idCompetition;
      // body
      const { nombre, description } = req.body;

      //Verificar que no hayan campos vacios
      if (!nombre || !description || !competitionId || !fileName) {
        return res.status(400).json({
          success: false,
          mensaje: "Todos los campos son obligatorios y se debe subir un archivo.",
          data: null
        });
      }

      //Insertar los datos en tabla
      await conexion.execute(
        "INSERT INTO documents (fileName,documentName, description, uploadDate, competitionId) VALUES(?,?,?,?,?)",
        [fileName, nombre, description, uploadDate, competitionId]
      );

      // Respuesta JSON consistente
      res.status(201).json({
        success: true,
        mensaje: "Nuevo documento agregado exitosamente",
        data: {
          fileName: req.file.filename,
          originalName: req.file.originalname,
          documentName: nombre,
          description,
          uploadDate,
          competitionId,
          filePath: path.join(documentsDir, req.file.filename)
        }
      });

    } catch (error) {
      // Si hay error y se subió un archivo, eliminarlo
      if (req.file) {
        const filePath = path.join(documentsDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({
        success: false,
        mensaje: "Error al subir el documento",
        error: error.message,
        detalles: error.stack
      });
    }
  }
);

module.exports = router;
