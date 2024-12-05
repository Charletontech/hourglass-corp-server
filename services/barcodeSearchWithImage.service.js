const Quagga = require("@ericblade/quagga2");

// Function to decode barcode from a static image
const barcodeSearchService = async (imagePath) => {
  return new Promise((resolve, reject) => {
    Quagga.decodeSingle(
      {
        src: imagePath,
        numOfWorkers: 0,
        inputStream: {
          size: 800,
        },
        decoder: {
          readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
          locate: true,
        },
      },
      function (result) {
        if (result && result.codeResult) {
          resolve(result.codeResult.code);
          deleteFile(imagePath);
        } else {
          resolve(null);
          deleteFile(imagePath);
        }
      }
    );
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

module.exports = barcodeSearchService;
