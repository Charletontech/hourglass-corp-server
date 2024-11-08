const audioTextPrompt = require("../services/audioTextPrompt.service");
const barcodeSearchService = require("../services/barcodeSearch.service");
const fileUploadService = require("../utils/fileUpload.utils");
const getFilteredProductsFromDB = require("../database/getFilteredProductsFromDB.database");
const imageSearchService = require("../services/imageSearch.service");
const getProductWithBarcode = require("../database/getProductWithBarcode.database");

const viewController = (req, res) => {
  const path = require("path");
  var page = path.join(__dirname, "..", "views", "index.html");
  res.sendFile(page);
};

const imageSearchController = async (req, res) => {
  try {
    const imagePath = await fileUploadService(req);
    if (imagePath) {
      var searchResult = await imageSearchService(res, imagePath);
      if (searchResult.startsWith("[") && searchResult.endsWith("]")) {
        var formatted = searchResult.slice(1, searchResult.length - 2);
        const finalResult = await getFilteredProductsFromDB(formatted);
        console.log(finalResult);
        res.status(200).json({ data: finalResult });
      } else if (searchResult === null) {
        res.status(501).json({
          data: "error ocurred when detecting image / when getting fetching all products from database.",
        });
        return;
      } else {
        console.log("No matching product data found.");
        res.status(501).json({ data: "No matching product data found" });
        return;
      }
    } else {
      throw new Error("Image File upload error");
    }
  } catch (error) {
    res.status(501).json({ data: error });
    console.log(error);
  }
};

const barcodeSearchController = async (req, res) => {
  const imagePath = await fileUploadService(req);
  if (imagePath) {
    barcodeSearchService(imagePath)
      .then(async (barcode) => {
        if (barcode) {
          const products = await getProductWithBarcode(barcode);
          if (products === null) {
            console.log("product not found");
            res.status(200).json({
              data: "No matching product with the specified barcode exists",
              response: "not found",
            });
          } else {
            console.log("Products found", products);
            res.status(200).json({ data: products, response: "found" });
          }
        } else {
          console.log("No barcode detected in the image");
          res.status(501).json({ data: "No barcode detected in the image" });
        }
      })
      .catch((error) => {
        res.status(501).json({ message: "error detecting barcode" });
        console.error("Error decoding barcode:", error);
      });
  } else {
    return res.status(500).send("Error parsing the file upload");
  }
};

const voiceSearchController = async (req, res) => {
  const filePath = await fileUploadService(req);
  if (filePath) {
    try {
      var arrayOfProductId = await audioTextPrompt(filePath);
      if (!arrayOfProductId) {
        throw new Error(
          "Server Failed to generate search results OR failed to get all products"
        );
      }

      if (arrayOfProductId.startsWith("null")) {
        console.log("No matching product data  in product database.");
        throw new Error("No matching product data found in product database");
      } else {
        var formatted = arrayOfProductId.slice(1, arrayOfProductId.length - 2);
        const finalResult = await getFilteredProductsFromDB(formatted);
        console.log(finalResult.length);
        res.status(200).json({ data: finalResult });
      }
    } catch (error) {
      console.log(error);
      res.status(501).json({
        data: error,
      });
    }
  } else {
    res.status(501).json({ data: "Error uploading file..." });
  }
};

module.exports = {
  imageSearchController,
  barcodeSearchController,
  voiceSearchController,
  viewController,
};
