const jwt = require("jsonwebtoken");

const secret = "cambiaravariabledeentorno";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJleHBlcnRvIiwiaWF0IjoxNzQ3MDU5OTkwfQ.IlHNPq7dpjmFAYZLIc51In7F_uiw1pGbutmMcjLLFYs";

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
