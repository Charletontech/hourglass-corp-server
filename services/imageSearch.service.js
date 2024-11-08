const fs = require("fs");
const path = require("path");
const getAllProducts = require("../database/getAllProducts.database");

const imageSearchService = async (res, imagePath) => {
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
        reject(null);
        throw new Error(
          "an error ocurred while fetching all products from database. ERLOCATION: imageSearchPrompt.service.js"
        );
      }
      allProducts = JSON.stringify(allProducts);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Prompt with an image
      const prompt = `identify the single most prominent object in the image, compare it with this json dataset from an e-commerce platform database provided below. Respond with a javascript array only containing a list of ID of all products similar to what is identified as the most prominent object in the image. if none matches please response with "no match" only.
        do not include any sentences in your response. 
        JSON data: ${allProducts}
        `;

      const imagePart = fileToGenerativePart(imagePath, "image/jpeg");

      // Combine prompt and image
      const combinedPrompt = [prompt, imagePart];

      const generatedContent = await model.generateContent(combinedPrompt);

      // delete file after use
      deleteFile(imagePath);

      console.log(generatedContent.response.text());
      resolve(generatedContent.response.text());
    }

    try {
      run();
    } catch (error) {
      reject(null);
      console.log(error, " ERLOCATION: imageSearch service");
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

module.exports = imageSearchService;
