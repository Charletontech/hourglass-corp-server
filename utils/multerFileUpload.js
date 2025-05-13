const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check and create the directory inside the callback as well (for robustness)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
