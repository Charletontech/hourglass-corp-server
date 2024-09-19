const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

//enabling cors
app.use(
  cors({
    origin: "https://hourglass-corp.netlify.app/",
    credentials: true,
  })
);
app.options("*", cors());

app.use("/", router);

module.exports = app;
