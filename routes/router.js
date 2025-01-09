const express = require("express");
const router = express.Router();
const {
  imageSearchController,
  imageSearchControllerV2,
  barcodeSearchController,
  voiceSearchController,
  viewController,
  fuzz,
} = require("../controllers/controller");

// public routes
router.get("/", viewController);

// private routes
router.post("/api/image-search", imageSearchControllerV2);
router.post("/api/barcode-search", barcodeSearchController);
router.post("/api/voice-search", voiceSearchController);
module.exports = router;
