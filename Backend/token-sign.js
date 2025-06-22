const jwt = require("jsonwebtoken");

const secret = "cambiaravariabledeentorno";
const payload = {
  sub: 1,
  role: "experto",
};

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);
