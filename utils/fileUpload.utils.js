const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

const fileUploadService = async (req) => {
  return new Promise((resolve, reject) => {
    // Define the folder for file storage (one level above the server file)
    const storageDir = path.join(__dirname, "../uploads");

    // Ensure the upload directory exists
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir);
    }

    const form = new formidable.IncomingForm({
      uploadDir: storageDir,
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        reject(null);
      }

      // Get the uploaded file path
      const file = files.file;
      const filePath = file.filepath;
      resolve(filePath);
    });
  });
};

module.exports = fileUploadService;
