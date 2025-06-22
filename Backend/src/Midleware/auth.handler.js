const { errors } = require("../network/errors");
const { app } = require("../config.js");
const boom = require("@hapi/boom");
const { check } = require("express-validator");

function checkApiKey(req, res, next) {
  const apiKey = req.headers["api"];
  if (apiKey == app.apiKey) {
    next();
  } else {
    next(errors("API key inválida", 401));
  }
}

function checkRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.rol)) {
      next();
    } else {
      next(boom.unauthorized("No tienes permisos para acceder a este recurso"));
    }
  };
}

module.exports = { checkApiKey, checkRoles };
