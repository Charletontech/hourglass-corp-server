require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const deleteFile = require("../utils/deleteFile.utils");

const audioTranscriptionService = (filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      try {
        const transcriptionResponse = await sendTranscriptionRequest(filePath);
        if (transcriptionResponse.success) {
          resolve(transcriptionResponse.result.text);
        } else {
          reject(
            new Error(
              "Error! cloudfare unable to understand/transcribe audio recording: " +
                error.message
            )
          );
        }
        deleteFile(filePath);
      } catch (error) {
        deleteFile(filePath);
        reject(
          new Error(
            "Error occurred during cloudfare transcription process: " +
              error.message
          )
        );
      }
    } catch (error) {
      deleteFile(filePath);
      reject(new Error("Error during file upload: " + error.message));
    }
  });
};

async function sendTranscriptionRequest(filePath) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const response = await axios({
    method: "post",
    url: process.env.CLOUDFLARE_STT_URL,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${process.env.CLOUDFLARE_WORKER_TOKEN}`,
    },
  });

  return response.data;
  //   console.log(response.data.result.text);
}

module.exports = audioTranscriptionService;
