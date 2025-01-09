const getAllProducts = require("../database/getAllProducts.database");

const audioTextPrompt = (filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      var allProducts = await getAllProducts();
      if (allProducts === null) {
        throw new Error("Failed to get all products in database");
      }
      allProducts = JSON.stringify(allProducts);

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
      const fs = require("fs");
      const base64Buffer = fs.readFileSync(filePath);
      const base64AudioFile = base64Buffer.toString("base64");

      // Initialize a Gemini model appropriate for your use case.
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-8b",
      });

      // Generate content using a prompt and the metadata of the uploaded file.
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/mp3",
            data: base64AudioFile,
          },
        },
        {
          text: `
          Instruction: You are provided with an audio and a json data. The audio contains a voice recording about a product to be searched for from an e-commerce platform. 
          The json data represents a list of products in an e-commerce website database. 
          search through the json data and filter it and return an array containing only the id of products that match as much as possible the description in the audio provided. 
          if none matches please response with "null" only. Do not add any extra sentences in any of your response.
          Your response should look like this "[12, 8, 234, ...]"
          JSON data: ${allProducts}
          `,
        },
      ]);

      resolve(result.response.text());
      deleteFile(filePath);
    } catch (error) {
      console.log(error);
      reject(null);
      deleteFile(filePath);
    }
  });
};

function deleteFile(filePath) {
  const fs = require("fs");
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      // console.log("File deleted:", filePath);
    }
  });
}

module.exports = audioTextPrompt;
