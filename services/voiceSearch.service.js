const getFilteredProductsFromDB = require("./getFilteredProductsFromDB.service");
const voiceSearchPrompt = require("./voiceSearchPrompt.service");

require("dotenv").config();
const voiceSearchService = async (res, filePath) => {
  const axios = require("axios");
  const fs = require("fs");
  const FormData = require("form-data");

  const url = "https://lb1.voice-transcribe.com/transcribe";
  const data = {
    api_key: process.env.WHISPER_API_KEY,
    response_format: "json",
  };

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  Object.keys(data).forEach((key) => formData.append(key, data[key]));

  axios
    .post(url, formData, {
      headers: formData.getHeaders(),
    })
    .then(async (response) => {
      deleteFile(filePath);
      // send prompt to AI
      var arrayOfProductId = await sendTextCommandToAI(
        response.data.response.text
      );

      if (arrayOfProductId.startsWith("null")) {
        console.log("No matching product data found.");
        res.status(501).json({ data: "No matching product data found" });
      } else {
        console.log(arrayOfProductId);
        var formatted = arrayOfProductId.slice(1, arrayOfProductId.length - 2);
        const finalResult = await getFilteredProductsFromDB(formatted);
        res.status(200).json({ data: finalResult });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(501).json({ data: "An error ocurred" });
    });
};

function deleteFile(filePath) {
  const fs = require("fs");
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted:", filePath);
    }
  });
}

async function sendTextCommandToAI(command) {
  const data = await voiceSearchPrompt(command);
  return data;
}

module.exports = voiceSearchService;
