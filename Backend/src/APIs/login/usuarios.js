// src/APIs/login/usuarios.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const { updateUserPasswordByEmail } = require("../../db_connection/mysql");

const router = express.Router();

router.post("/", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err && err.isBoom) {
      return res.status(err.output.statusCode).json(err.output.payload);
    }
    if (err) {
      return res.status(500).json({ statusCode: 500, error: err.message });
    }
    if (!user) {
      if (info && info.isBoom) {
        return res.status(info.output.statusCode).json(info.output.payload);
      }
      return res.status(401).json({ statusCode: 401, error: "Unauthorized" });
    }

    if (user.rol === "Inscrito") {
      return res
        .status(403)
        .json({ statusCode: 403, error: "Acceso denegado para rol Inscrito" });
    }

    const payload = { sub: user.id, rol: user.rol };
    const token = jwt.sign(payload, config.app.jwtSecret, { expiresIn: "1d" });
    return res.json({ user, token });

  })(req, res);
});

router.post("/recovery", async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email y newPassword son obligatorios" });
    }

    // Hasheamos la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Intentamos actualizar
    const updated = await updateUserPasswordByEmail(email, hashedPassword);
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error en /login/recovery:", err);
    next(err); // Pasar al errorHandler para enviar 500
  }
});

module.exports = router;
