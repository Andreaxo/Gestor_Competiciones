
const path=require("path");
require ('dotenv').config({
  path:path.resolve(__dirname,"../../.env")
});
const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);
const port = 3000;
const { errorHandler } = require("../network/errors.js"); // Importar correctamente

/* Usuarios */
const config = require(".././config");
const morgan = require("morgan");

app.use(passport.initialize());
require("../utils/auth/index.js");

///----------------------Importar------------------------------------------///
// Carpetas

/* Ruta de email */
const emailRoutes = require("../modules/routes/routes_email.js");

const clientes = require("../../src/modules/routes/routes.js");

/* Formularios */
const formulario = require("../modules/form/rutas.js");

/* Eventos */
const eventos = require(".././modules/routes/routes_events.js");

// Importar rutas competiciones
const getCompetitions = require("../APIs/competitions/get");
const getCompetitionsById = require("../APIs/competitions/getById");
const postCompetitions = require("../APIs/competitions/post");
const updateCompetitions = require("../APIs/competitions/put");
const deleteCompetitions = require("../APIs/competitions/delete");

// Importar rutas habilidades
const getSkills = require("../APIs/skills/get");
const getSkillById = require("../APIs/skills/getById");
const postSkills = require("../APIs/skills/post");
const updateSkill = require("../APIs/skills/put");
const deleteSkill = require("../APIs/skills/delete");
const patchSkill1 = require("../APIs/skills/patch1.js");
const patchSkill2 = require("../APIs/skills/patch2.js");

// Importar rutas Documentos
const postByCompetition = require("../APIs/documents/postByCompetition.js");
const postBySkill = require("../APIs/documents/postBySkill.js");
const getDocumentbyIdCompetition = require("../APIs/documents/getByCompetitionId.js");
const getDocumentbyIdSkill = require("../APIs/documents/getBySkillId.js");
const downloadByFileName = require("../APIs/documents/downloadByFileName.js");
const deleteByFileName = require("../APIs/documents/deleteByFileName.js");

// Importar rutas de usuarios
const sendLoginInfo = require("../APIs/login/usuarios.js"); // Asegúrate de que la ruta sea correcta
///--------------------------------------------------------------------------///
///
//
//// Importar Imagenes
const getImgByFileName = require("../APIs/img/getImgByName.js");

///
// ----------------------Llamadas------------------------------------------///
//Llamar competiciones
app.use(
  "/competitions",
  getCompetitions,
  getCompetitionsById,
  postCompetitions,
  deleteCompetitions,
  updateCompetitions
);

//Llamar habilidades
app.use(
  "/skills",
  getSkills,
  getSkillById,
  postSkills,
  updateSkill,
  deleteSkill,
  patchSkill1,
  patchSkill2
);

//Llamar documentos
app.use(
  "/document",
  postByCompetition,
  postBySkill,
  getDocumentbyIdCompetition,
  getDocumentbyIdSkill,
  downloadByFileName,
  deleteByFileName
);
//-----------------------------------------------------------------------------------//
//Llamar imagenes
app.use("/", getImgByFileName);

app.listen(port, () => {
  console.log("El servidor esta en linea en el puerto 3000");
});

// Middleware

app.use(morgan("dev")); // Este es para mirar que se ha necesitado de consultas.
app.use(express.urlencoded({ extended: true })); // Este middleware es también para reconocer datos codificados en formato application/x-www-form-urlencoded

// Configuración de puerto
app.set("port", config.app.port);

// Ruta eventos.
app.use("/api/eventos", eventos);

//Ruta de enviar email.
app.use("/api/email", emailRoutes);

// Rutas Usuarios
app.use("/api/clientes", clientes);

//Rutas Usuarios
app.use("/api/login", sendLoginInfo);
app.get("/", (req, res) => {
  res.send("Bienvenido al Backend API");
});

/* Rutas Formulario */
app.use("/api/formulario", formulario);

// Manejo de errores
app.use(errorHandler);
