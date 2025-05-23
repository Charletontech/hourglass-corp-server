const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const delay = require("../utils/delay");

const userRequestHistoryService = async ({ user }) => {
  return new Promise((resolve, reject) => {
    var sql = ORM.select("*", "hourglass_request_list", "phone", user);
    connectDB.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
    delay(3000);
  });
};
module.exports = userRequestHistoryService;
