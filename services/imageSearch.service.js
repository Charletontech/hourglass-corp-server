const fs = require("fs");
const path = require("path");
const getAllProducts = require("../database/getAllProducts.database");
const deleteFile = require("../utils/deleteFile.utils");

const imageSearchService = async (imagePath) => {
  return new Promise((resolve, reject) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);

    // Function to create a Part object for an image
    function fileToGenerativePart(path, mimeType) {
      return {
        inlineData: {
          data: Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType,
        },
      };
    }

    async function run() {
      var allProducts = await getAllProducts();
      if (allProducts === null) {
        reject(
          new Error(
            "an error ocurred while fetching all products from database. ERLOCATION: imageSearch.service.js"
          )
        );
      }
      allProducts = JSON.stringify(allProducts);

      // Set model and create Prompt
      // gemini-2.0-flash-thinking-exp-1219
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const prompt = `INSTRUCTION: identify the single most prominent object in the image attached, compare it with the json dataset from an e-commerce platform database provided below. Respond with an array only containing a list of ID of all products similar to what is identified as the most prominent object in the image. if none matches please response with "no match" only.
        do not include any sentences in your response. Your response should look like this "[12, 8, 234, ...]" or "no match" when no match is found.
        JSON DATASET: ${allProducts}
        GUIDELINES FOR RESPONSE FORMAT: 
        1. Your response should be in string format
        2. Response should not contain any extra texts characters other than: e.g "[12, 8, 234, ...]" or "no match" when no match is found
        `;

      const imagePart = fileToGenerativePart(imagePath, "image/jpeg");

      // Combine prompt and image
      const combinedPrompt = [prompt, imagePart];

      const generatedContent = await model.generateContent(combinedPrompt);

      // delete file after use
      deleteFile(imagePath);

      // console.log(generatedContent.response.text());
      resolve(generatedContent.response.text());
    }

    try {
      run();
    } catch (error) {
      reject(
        new Error("Error processing image search prompt: " + error.message)
      );
      console.log(
        error,
        "Message: Error occurred while processing image search prompt.\nLOCATION: imageSearch service"
      );
    }
  });
};

module.exports = imageSearchService;
