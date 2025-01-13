const getFilteredProductsFromDB = require("../database/getFilteredProductsFromDB.database");
const barcodeSearchService = require("../services/barcodeSearch.service");
const imageSearchService = require("../services/imageSearch.service");
const imageSearchServiceV2 = require("../services/imageSearchV2.service");
const fileUploadService = require("../utils/fileUpload.utils");
const audioTranscriptionService = require("../services/audioTranscription.service");
const textPromptService = require("../services/textPrompt.service");

const viewController = (req, res) => {
  const path = require("path");
  var page = path.join(__dirname, "..", "views", "index.html");
  res.sendFile(page);
};

const imageSearchController = async (req, res) => {
  try {
    const imagePath = await fileUploadService(req);
    if (imagePath) {
      var searchResult = await imageSearchService(imagePath);
      console.log(searchResult);
      handleSearchResult(searchResult);
    } else {
      throw new Error("Image File upload error");
    }
  } catch (error) {
    res.status(501).json({ data: error.message });
    console.log(error.message);
  }

  async function handleSearchResult(searchResult) {
    if (searchResult !== "no match") {
      var formatted = searchResult.slice(1, searchResult.length - 2);
      const finalResult = await getFilteredProductsFromDB(formatted);

      // Respond to user
      res.status(200).json({ data: finalResult });
    } else {
      console.log("No matching product data  in product database.");
      res.status(404).json({ data: "no matching product" });
    }
  }
};

const imageSearchControllerV2 = async (req, res) => {
  try {
    var arrayOfProductId = await imageSearchServiceV2(req);
    console.log("AI prompt response: ", arrayOfProductId);
    if (!arrayOfProductId) {
      throw new Error(
        "Server Failed to generate search results OR failed to get all products"
      );
    }

    if (arrayOfProductId.startsWith("null")) {
      console.log("No matching product data  in product database.");
      res.status(404).json({ data: "no matching product" });
      return;
    } else {
      var formatted = arrayOfProductId.slice(1, arrayOfProductId.length - 2);
      const finalResult = await getFilteredProductsFromDB(formatted);
      console.log(finalResult);
      res.status(200).json({ data: finalResult });
    }
  } catch (error) {
    console.error(error);
    res.status(501).json({ data: error.message });
  }
};

const barcodeSearchController = async (req, res) => {
  try {
    const barcode = req.body.barcode;
    console.log(barcode);
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

const voiceSearchController = async (req, res) => {
  try {
    var transcribedText = await audioTranscriptionService(req);
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

// const voiceSearchController = async (req, res) => {
//   const filePath = await fileUploadService(req);
//   if (filePath) {
//     try {
//       var modelResponse = await textPromptService(filePath);
//       if (!modelResponse) {
//         throw new Error(
//           "Server Failed to generate search results OR failed to get all products"
//         );
//       }
//       console.log("model response: ", modelResponse);
//       function isConvertibleToArray(modelResponse) {
//         try {
//           var modelResponseToArray = JSON.parse(modelResponse);
//           return (
//             Array.isArray(modelResponseToArray) &&
//             modelResponseToArray.length !== 0
//           );
//         } catch (error) {
//           return false;
//         }
//       }

//       if (isConvertibleToArray(modelResponse)) {
//         var formatted = JSON.parse(modelResponse);
//         const finalResult = await getFilteredProductsFromDB(formatted);
//         console.log(finalResult);
//       } else {
//         console.log("No matching product data  in product database.");
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(501).json({
//         data: error.message,
//       });
//     }
//   } else {
//     res.status(501).json({ data: "Error uploading file..." });
//   }
// };

module.exports = {
  imageSearchController,
  imageSearchControllerV2,
  barcodeSearchController,
  voiceSearchController,
  viewController,
};
