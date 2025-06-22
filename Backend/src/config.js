require("dotenv").config({ path: __dirname + "/../.env" });

module.exports = {
  app: {
    port: process.env.PORT || 3000,
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
  },
  mysql: {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "123456",
    database: process.env.MYSQL_DB || "db_competiciones",
  },
};
