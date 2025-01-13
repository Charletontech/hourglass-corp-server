const getAllProducts = require("../database/getAllProducts.database");

const textPromptService = (transcribedText) => {
  return new Promise(async (resolve, reject) => {
    try {
      var allProducts = await getAllProducts();
      if (allProducts === null) {
        throw new Error("Failed to get all products in database");
      }
      allProducts = JSON.stringify(allProducts);

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      Instruction: You are provided a json data that represents a list of products in an e-commerce database. 
      Search through the json data provided below and return an array containing only the id of products that match as much as possible the description: "${transcribedText}". 
      if none matches please response with "null" only. Do not include any unrelated products that do not match the description. Do not add any extra sentences in any of your response.
      Your response should look like this "[12, 8, 234, ...]" or "null" when no matching product is found.
      JSON data: ${allProducts}
      `;
      const result = await model.generateContent(prompt);
      // console.log(result.response.text());
      resolve(result.response.text());
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

module.exports = textPromptService;
