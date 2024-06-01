const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = require('./routes/router')
require("dotenv").config();
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', router)



module.exports = app;