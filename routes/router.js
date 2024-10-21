const express = require("express");
const router = express.Router();
const {
  signUpHandler,
  refreshHandler,
  webhookHandler,
  initDBHandler,
} = require("../controllers/controller");

// public routes
router.post("/signup", signUpHandler);
router.get("/initDB", initDBHandler);
router.get("/refresh-server", refreshHandler);
router.post("/webhook", webhookHandler);

module.exports = router;
