const express = require("express");
const router = express.Router();
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const multer = require("multer");

router.use(express.json());
router.use(cors());
const aleatorio = Date.now();
// Imports de rutas y Variables
const { updateCompetitions } = require("../../Routes/competitionsRoutes.js");

// Configuración almacenamiento multer
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

// Update de competiciones
router.put(
  updateCompetitions,
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  async (req, res) => {
    const id = req.params.idCompetition;

    try {
      const {
        competitionName,
        competitionDate,
        place,
        description,
        competitorsAge,
      } = req.body;

      let image;

      if (req.file) {
        image = `${aleatorio}${req.file.originalname}`;
      } else {
        // Si no hay nueva imagen, usar la ya existente
        const [rows] = await mysqlDB.conexionDB.execute(
          `SELECT imagenName FROM competitions WHERE idCompetitions = ?`,
          [id]
        );
        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Competencia no encontrada",
          });
        }
        image = rows[0].imagenName;
      }

      await mysqlDB.conexionDB.execute(
        `UPDATE competitions 
           SET competitionName = ?,
               competitionDate = ?,
               place           = ?,
               imagenName      = ?,
               description     = ?,
               competitorsAge  = ?
         WHERE idCompetitions = ?`,
        [
          competitionName,
          competitionDate,
          place,
          image,
          description,
          competitorsAge,
          id,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Competición modificada correctamente",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error interno al modificar",
        error: error.message,
      });
    }
  }
);


module.exports = router;
