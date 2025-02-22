const deleteFile = require("../utils/deleteFile.utils");
const audioTranscriptionService = require("./audioTranscription.service");
const convertToMP3 = require("./convertToMp3.service");
const fs = require("fs").promises;

const speechToText = async (filePath) => {
  var mp3FilePathRef;
  try {
    const mp3FilePath = await convertToMP3(filePath);
    const transcribedText = await audioTranscriptionService(mp3FilePath);
    mp3FilePathRef = mp3FilePath;
    console.log(transcribedText);
    return transcribedText;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  } finally {
    if (await fileExists(filePath)) {
      deleteFile(filePath);
    }
    if (mp3FilePathRef && (await fileExists(mp3FilePathRef))) {
      deleteFile(mp3FilePathRef);
    }
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath); // Check if the file exists
    return true;
  } catch (error) {
    return false;
  }
};
module.exports = speechToText;
