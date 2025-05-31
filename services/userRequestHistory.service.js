const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const delay = require("../utils/delay");

const userRequestHistoryService = async ({ user }) => {
  return new Promise((resolve, reject) => {
    connectDB.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      var sql = ORM.select("*", "hourglass_request_list", "phone", user);
      connection.query(sql, (err, result) => {
        connection.release();
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  });
};
module.exports = userRequestHistoryService;
