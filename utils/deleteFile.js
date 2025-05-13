const fs = require("fs");

function deleteFile(filepath) {
  fs.unlink(filepath, (err) => {
    if (err) throw new Error("Error occurred while deleting file");
    console.log("\n\nfile deleted");
  });
}

module.exports = deleteFile;
