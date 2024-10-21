const mysql = require("mysql");
require("dotenv").config();

const connectDB = mysql.createConnection({
  host: `${process.env.HOURGLASS_HOST}`,
  user: `${process.env.HOURGLASS_USER}`,
  password: `${process.env.HOURGLASS_PASSWORD}`,
  port: 3306,
  database: `${process.env.HOURGLASS_DB}`,
});

module.exports = connectDB;
