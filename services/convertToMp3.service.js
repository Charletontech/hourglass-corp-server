const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const deleteFile = require("../utils/deleteFile.utils");
ffmpeg.setFfmpegPath(
  "C:/My custom program files/ffmpeg-7.1-essentials_build/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe"
);

// Ensure "output_files" directory exists
const outputDir = path.join(__dirname, "output_files");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertToMP3(inputFile) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(inputFile, path.extname(inputFile)) + ".mp3";
    const outputFile = path.join(outputDir, fileName);

    ffmpeg(inputFile)
      .toFormat("mp3")
      .audioCodec("libmp3lame")
      .on("end", () => {
        // console.log("✅ Conversion finished: ", outputFile);
        resolve(outputFile);
      })
      .on("error", (err) => {
        console.error("❌ Error during conversion:", err);
        deleteFile(inputFile);
        reject(err);
      })
      .save(outputFile);
  });
}

module.exports = convertToMP3;
