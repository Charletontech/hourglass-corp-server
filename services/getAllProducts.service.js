const connectDB = require("../database/main.database");
const ORM = require("../database/CharlieDB");
const getAllProducts = async () => {
  return new Promise((resolve, reject) => {
    try {
      var tables = ["id", "title"];
      //   var tables = ["id", "title", "description"];
      var sql = ORM.select(tables, "products");
      connectDB.query(sql, (err, result) => {
        if (err) throw new Error(err);

        const convertResultToJson = result.map((row) => ({
          id: row.id,
          title: row.title,
        }));
        resolve(convertResultToJson);
      });
    } catch (error) {
      reject(null);
      console.log(error);
    }
  });
};

module.exports = getAllProducts;
