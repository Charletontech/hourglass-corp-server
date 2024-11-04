<<<<<<< HEAD
const barcodeSearchService = require("../services/barcodeSearch.service");
const fileUploadService = require("../services/fileUpload.service");
const getAllProducts = require("../services/getAllProducts.service");
const getFilteredProductsFromDB = require("../services/getFilteredProductsFromDB.service");
const imageSearchService = require("../services/imageSearch.service");
const voiceSearchService = require("../services/voiceSearch.service");

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

      if (searchResult.startsWith("no match")) {
        console.log("No matching product data found.");
        res.status(501).json({ data: "No matching product data found" });
        return;
      } else if (searchResult === null) {
        res.status(501).json({
          data: "error ocurred when detecting image / when getting fetching all products from database.",
        });
        return;
      } else {
        //     searchResult = JSON.parse(searchResult);
        var formatted = searchResult.slice(1, searchResult.length - 2);
        console.log(formatted);
        const finalResult = await getFilteredProductsFromDB(formatted);
        console.log(finalResult);
        res.status(200).json({ data: finalResult });
      }
    } else {
      throw new Error("Image File upload error");
    }
  } catch (error) {
    res.status(501).json({ data: error });
    console.log(error);
  }

  // try {
  //   const imagePath = await fileUploadService(req);
  //   if (imagePath) {
  //     var searchResult = await imageSearchService(res, imagePath);
  //     searchResult = JSON.parse(searchResult);
  //     if (searchResult.length !== 0) {
  //       res.status(200).json({ data: searchResult });
  //     } else {
  //       throw new Error("Empty response");
  //     }
  //   } else {
  //     throw new Error("Image File upload error");
  //   }
  // } catch (error) {
  //   res.status(501).json({ data: error });
  //   console.log(error);
  // }
};

const barcodeSearchController = async (req, res) => {
  const imagePath = await fileUploadService(req);
  if (imagePath) {
    barcodeSearchService(imagePath)
      .then((barcode) => {
        if (barcode) {
          console.log("Barcode detected:", barcode);
          res.status(200).json({ data: barcode });
        } else {
          console.log("No barcode detected in the image");
          res.status(501).json({ data: "No barcode found" });
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
  voiceSearchService(res, filePath);
};

module.exports = {
  imageSearchController,
  barcodeSearchController,
  voiceSearchController,
  viewController,
};
=======
const axios = require('axios')
const home = async  (req, res) => {
    // if (!req.headers['authorization']) {
    //     res.json({message:"access denied"})
    //     return
    // } else {
    //     req.headers['authorization'] === process.env.TOKEN ? 
    //     refreshServer() :
    //     res.json({message: "wrong token provided"})
    // }
     refreshServer()
    function refreshServer() {
        res.json({message:"BOT still running"})
        setInterval( async () => {
            var res = await axios.get('https://phoenixdigitalcrest.org/refresh')
            // console.log(res.data)
        },60 * 14 * 1000)
    }
   
}

module.exports = {home}
>>>>>>> 62c351ed93554cdbc3cdaccf03ecac88e516d34b
