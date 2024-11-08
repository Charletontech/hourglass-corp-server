const connectDB = require("./main.database");
const ORM = require("./CharlieDB");
const getProductWithBarcode = async (barcode) => {
  return new Promise((resolve, reject) => {
    let sql = ORM.select("*", "products", "barcode", `${barcode}`);
    // console.log(barcode);
    // console.log(sql);
    connectDB.query(sql, (err, result) => {
      if (err) {
        throw new Error(
          "Error querying database for product with specific barcode"
        );
      }
      if (result?.length === 0) {
        resolve(null);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = getProductWithBarcode;
