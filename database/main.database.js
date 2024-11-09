const mysql = require("mysql");
require("dotenv").config();

const connectDB = mysql.createConnection({
  host: process.env.BLOOMZON_HOST,
  user:  process.env.BLOOMZON_USER,
  password:  process.env.BLOOMZON_PASS,
  port: 3306,
  database:  process.env.BLOOMZON_DB,
});

module.exports = connectDB;
