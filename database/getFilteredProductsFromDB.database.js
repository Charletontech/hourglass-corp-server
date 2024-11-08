async function getFilteredProductsFromDB(arrayOfProductId) {
  return new Promise((resolve, reject) => {
    const connectDB = require("./main.database");
    // var sql = `SELECT * FROM products WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);`
    var sql = `SELECT * FROM products WHERE id IN (${arrayOfProductId});`;
    connectDB.query(sql, (err, result) => {
      if (err) {
        reject(null);
        throw new Error(
          "error querying database for filtered products. ERLOCATION: voiceSearch.service.js"
        );
      }
      resolve(result);
    });
  });
}

module.exports = getFilteredProductsFromDB;
