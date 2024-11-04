require("dotenv").config();
const getAllProducts = require("./getAllProducts.service");

const voiceSearchPrompt = async (command) => {
  try {
    // get all products from database
    var allProducts = await getAllProducts();
    if (allProducts === null) {
      throw new Error(
        "an error ocurred while fetching all products from database. ERLOCATION: voiceSearchPrompt.service.js"
      );
    }
    allProducts = JSON.stringify(allProducts);

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Instruction: Below, you are provided with a Search query and a json data representing a list of products in an e-commerce website database. search through the json data and filter it and return a javascript array containing only the id of products that match as much as possible the description in the Search query provided. if none matches please response with "null" only. do not add any extra sentences in any of your response.
      Search query: ${command}.
      JSON data: ${allProducts}
      `;

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    var data = result.response.text();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = voiceSearchPrompt;
