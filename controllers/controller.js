const getFilteredProductsFromDB = require("../database/getFilteredProductsFromDB.database");
const barcodeSearchService = require("../services/barcodeSearch.service");
const fileUploadService = require("../utils/fileUpload.utils");
const audioTranscriptionService = require("../services/audioTranscription.service");
const textPromptService = require("../services/textPrompt.service");
const speechToText = require("../services/speechToText.service");

const viewController = (req, res) => {
  const path = require("path");
  var page = path.join(__dirname, "..", "views", "index.html");
  res.sendFile(page);
};

const barcodeSearchController = async (req, res) => {
  try {
    const barcode = req.body.barcode;
    if (barcode) {
      let products = await barcodeSearchService(barcode);
      if (products === null) {
        console.log("product not found");
        res.status(404).json({
          data: "No matching product with the specified barcode exists",
        });
      } else {
        console.log("Products found");
        res.status(200).json({ data: products });
      }
    } else {
      throw new Error("Barcode is missing in request body");
    }
  } catch (error) {
    console.log(error.message);
    res.status(501).json({ data: error });
  }
};

const transcribeController = async (req, res) => {
  try {
    const filePath = await fileUploadService(req);
    const transcribedText = await speechToText(filePath);
    res.status(200).json({ data: transcribedText });
  } catch (error) {
    res.status(501).json({
      data: error.message,
    });
  }
};

const voiceSearchController = async (req, res) => {
  try {
    const filePath = await fileUploadService(req);
    var transcribedText = await audioTranscriptionService(filePath);
    var modelResponse = await textPromptService(transcribedText);
    if (!modelResponse) {
      throw new Error(
        "Server Failed to generate search results OR failed to get all products"
      );
    }
    function isConvertibleToArray(modelResponse) {
      try {
        var modelResponseToArray = JSON.parse(modelResponse);
        return (
          Array.isArray(modelResponseToArray) &&
          modelResponseToArray.length !== 0
        );
      } catch (error) {
        return false;
      }
    }

    if (isConvertibleToArray(modelResponse)) {
      var formatted = JSON.parse(modelResponse);
      const finalResult = await getFilteredProductsFromDB(formatted);
      // console.log(finalResult);
      res.status(200).json({ data: finalResult });
    } else {
      console.log("No matching product data  in product database.");
      res.status(404).json({ data: "no matching product" });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({
      data: error.message,
    });
  }
};

module.exports = {
  barcodeSearchController,
  voiceSearchController,
  viewController,
  transcribeController,
};
