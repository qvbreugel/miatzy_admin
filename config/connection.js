const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.DB_HOST, // Host name for database connection:
  user: process.env.DB_USER, // Database user:
  password: process.env.DB_PW, // Password for the above database user:
  database: process.env.DB_NAME // Database name:
});

module.exports = connection;
