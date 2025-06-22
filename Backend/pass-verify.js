const bcrypt = require("bcryptjs");

async function verifyPassword() {
  const password = "admin 123 123";
  const hash = "$2b$10$1HpnXU2PxU92ctqV5M5EGulEhF8.uu1y3zgAlGFCxJpUIZU.Es5sm";
  const isMatch = await bcrypt.compare(password, hash);
}

verifyPassword();
