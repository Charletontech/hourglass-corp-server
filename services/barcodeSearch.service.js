const getProductWithBarcode = require("../database/getProductWithBarcode.database");

const barcodeSearch = async (barcode) => {
  const result = await getProductWithBarcode(barcode);
  return result;
};

module.exports = barcodeSearch;
