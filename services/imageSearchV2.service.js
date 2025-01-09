const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const getAllProducts = require("../database/getAllProducts.database");

// const imageSearchV2 = (req) => {
//   return new Promise(async (resolve, reject) => {
//     require("dotenv").config();
//     const fileUploadService = require("../utils/fileUpload.utils");

//     const imagePath = await fileUploadService(req);
//     if (imagePath !== null) {
//       const formData = new FormData();
//       formData.append("file", fs.createReadStream(imagePath));
//       axios({
//         method: "post",
//         url: process.env.ML_MODEL_URL,
//         data: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//         .then((response) => {
//           deleteFile(imagePath);
//           console.log("Response:", response.data);
//           // const data = textPrompt(response);
//           resolve(response.data);
//         })
//         .catch((error) => {
//           deleteFile(imagePath);
//           reject(null);
//           throw new Error("Axios request error: ", error);
//         });
//     } else {
//       throw new Error(
//         "formidable error: error occurred while handling file upload"
//       );
//     }
//   });
// };

const imageSearchV2 = (req) => {
  return new Promise(async (resolve, reject) => {
    require("dotenv").config();
    const fileUploadService = require("../utils/fileUpload.utils");

    try {
      const imagePath = await fileUploadService(req);

      if (imagePath !== null) {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(imagePath));

        try {
          const response = await axios({
            method: "post",
            url: process.env.ML_MODEL_URL,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          deleteFile(imagePath);
          // console.log(await textPrompt(response.data));
          console.log(response.data);
          response?.data?.error
            ? reject(
                new Error(
                  "Machine Learning Model error: " + response.data.error
                )
              )
            : resolve(await textPrompt(response.data));
        } catch (error) {
          deleteFile(imagePath);
          reject(new Error("Error processing image search: " + error.message));
        }
      } else {
        reject(new Error("Error uploading file"));
      }
    } catch (error) {
      reject(new Error("Error during file upload: " + error.message));
    }
  });
};

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted:", filePath);
    }
  });
}

async function textPrompt(modelResponse) {
  var allProducts = await getAllProducts();
  if (allProducts === null) {
    throw new Error("Failed to get all products in database");
  }
  allProducts = JSON.stringify(allProducts);

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Instruction: You are provided with a json data. The json data represents a list of products in an e-commerce website database.
          search through the json data and filter it and return an array containing only the id of products that match as much as possible this description: "${modelResponse}".
          if none matches please response with "null" only. Do not add any extra sentences in any of your response.
          Your response should look like this "[12, 8, 234, ...]"
          JSON data: ${allProducts}
  `;

  const result = await model.generateContent(prompt);
  // console.log(result.response.text());
  return result.response.text();
}

module.exports = imageSearchV2;
