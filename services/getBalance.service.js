const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const getBalanceService = async (phone) => {
  return new Promise((resolve, reject) => {
    var sql = ORM.select("wallet", "hourglass_users", "phone", phone);
    connectDB.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
};
module.exports = getBalanceService;
