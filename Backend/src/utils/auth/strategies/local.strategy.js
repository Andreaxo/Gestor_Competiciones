const { Strategy } = require("passport-local");
const boom = require("@hapi/boom");
const { loginUser } = require("../../../db_connection/mysql");
const LocalStrategy = new Strategy(
  {
    usernameField: "email", // coincide con <input name="email"…
    passwordField: "password", // coincide con <input name="password"…
  },
  async (email, password, done) => {
    try {
      const user = await loginUser("usuarios", { email, password });
      return done(null, user);
    } catch (err) {
      // Credenciales inválidas → 401
      if (err.code === "USER_NOT_FOUND" || err.code === "INVALID_CREDENTIALS") {
        return done(
          null,
          false,
          boom.unauthorized("Usuario o contraseña incorrectos")
        );
      }
      // Otro error → 500
      return done(boom.internal("Error interno al autenticar"));
    }
  }
);

module.exports = LocalStrategy;
