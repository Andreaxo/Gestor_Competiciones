const bcrypt = require("bcryptjs");

async function hashPassword() {
  const password = "admin 123 123";
  const hash = await bcrypt.hash(password, 10);
}

hashPassword();
