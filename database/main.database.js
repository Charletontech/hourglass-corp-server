const mysql = require("mysql");
require("dotenv").config();

const connectDB = mysql.createPool({
  connectionLimit: 4,
  host: `${process.env.HOURGLASS_HOST}`,
  user: `${process.env.HOURGLASS_USER}`,
  password: `${process.env.HOURGLASS_PASSWORD}`,
  port: process.env.DB_PORT || 3307,
  database: `${process.env.HOURGLASS_DB}`,
});

module.exports = connectDB;
