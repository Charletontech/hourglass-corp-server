const express = require("express");
const router = express.Router();
const { signUpHandler, refreshHandler } = require("../controllers/controller");

// public routes
router.post("/signup", signUpHandler);
router.get("/refresh-server", refreshHandler);
module.exports = router;
