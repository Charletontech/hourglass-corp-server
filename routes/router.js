const express = require("express");
const router = express.Router();
const {
  barcodeSearchController,
  voiceSearchController,
  viewController,
  transcribeController,
} = require("../controllers/controller");

// public routes
router.get("/", viewController);

// private routes
router.post("/api/barcode-search", barcodeSearchController);
router.post("/api/voice-search", voiceSearchController);
router.post("/api/transcribe", transcribeController);
module.exports = router;
