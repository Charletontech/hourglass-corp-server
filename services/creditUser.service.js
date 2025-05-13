const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const creditUser = async ({ fundAmount, phone }) => {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE hourglass_users SET wallet = wallet + ${fundAmount} WHERE phone = "${phone}"`;
    connectDB.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
module.exports = creditUser;
