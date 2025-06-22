const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const multer = require("multer");

router.use(express.json());
router.use(cors());

// Imports de rutas y Variables
const { createCompetitions } = require("../../Routes/competitionsRoutes.js");
const aleatorio = Date.now();

// Nota: mejor mover el aleatorio dentro del endpoint para evitar usar siempre la misma fecha
// (Date.now() se ejecuta una vez al cargar el archivo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../../../public/assets/img/competitionsImg")
    );
  },
  filename: (req, file, cb) => {

    const reformImgName = aleatorio + file.originalname;
    cb(null, reformImgName);
  },
});

const upload = multer({ storage });

router.post(
  createCompetitions,
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Usar pool directamente
      const {
        competitionName,
        competitionDate,
        place,
        description,
        competitorsAge,
      } = req.body;

      // Calculamos aleatorio aquí para que sea nuevo en cada petición


      const image = req.file ? `${aleatorio}${req.file.originalname}` : null;

      await mysqlDB.conexionDB.execute(
        "INSERT INTO competitions (competitionName, competitionDate, place, imagenName, description, competitorsAge) VALUES(?,?,?,?,?,?)",
        [
          competitionName,
          competitionDate,
          place,
          image,
          description,
          competitorsAge,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Nueva competencia agregada correctamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error interno al crear la competencia",
        error: error.message,
      });
    }
  }
);

module.exports = router;
