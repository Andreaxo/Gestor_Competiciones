// Imports de framework y modulos MySQL
const express = require("express");
const router = express.Router();
const app = express();
const mysqlDB = require("../../db_connection/conexion.js");
const cors = require("cors");
const passport = require("passport");
app.use(cors());

//Imports de Variables
const {
  getDocumentbyIdCompetition,
} = require("../../Routes/documentsRoutes.js");

//Get de competiciones por id//
router.get(
  getDocumentbyIdCompetition,
  /* passport.authenticate("jwt", { session: false }), */
  async (req, res) => {
    const idCompetition = req.params.idCompetition;

    try {
      //Conectar a la base de datos
      const conexion = mysqlDB.conexionDB;

      //Consulta SQL
      const [filas] = await conexion.execute(
        "SELECT * FROM documents where competitionId=?",
        [idCompetition]
      );

      // Enviar los resultados
      res.send(filas);
    } catch (error) {
      //Enviar error en caso de falla
      res.status(500).send({
        mensaje: error.message,
        detalles: error.stack, //detalles del error
      });
    }
  }
);

module.exports = router;
