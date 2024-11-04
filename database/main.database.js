const mysql = require("mysql");
require("dotenv").config();

const connectDB = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  port: 3306,
  database: "bloomzon",
});

module.exports = connectDB;
