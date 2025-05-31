const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const getBalanceService = async (phone) => {
  return new Promise((resolve, reject) => {
    connectDB.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      var sql = ORM.select("wallet", "hourglass_users", "phone", phone);
      connectDB.query(sql, (err, result) => {
        connection.release();
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });
  });
};
module.exports = getBalanceService;
