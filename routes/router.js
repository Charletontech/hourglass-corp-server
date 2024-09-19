const express = require("express");
const router = express.Router();
const { signUpHandler } = require("../controllers/controller");

// public routes
router.post("/signup", signUpHandler);
module.exports = router;
