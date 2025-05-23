const mysql = require("mysql");
require("dotenv").config();

const connectDB = mysql.createPool({
  connectionLimit: 5,
  host: process.env.HOURGLASS_HOST,
  user: process.env.HOURGLASS_USER,
  password: process.env.HOURGLASS_PASSWORD,
  port: process.env.DB_PORT || 3307,
  database: process.env.HOURGLASS_DB,
  waitForConnections: true,
  queueLimit: 0,
  acquireTimeout: 3000, // Avoid long waits for free connections
  timeout: 10000, // Force idle connections to close sooner
});

module.exports = connectDB;
