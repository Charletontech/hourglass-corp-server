const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const getRequestHistoryService = async () => {
  return new Promise((resolve, reject) => {
    var sql = ORM.select("*", "hourglass_request_list");
    connectDB.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
module.exports = getRequestHistoryService;
