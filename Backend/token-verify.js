const jwt = require("jsonwebtoken");

const secret = "cambiaravariabledeentorno";
  //Aquí iría el secreto necesario del JWT.
const token =
  //Aquí iría el token necesario del JWT.

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
