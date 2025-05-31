const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const creditUser = async ({ fundAmount, phone }) => {
  return new Promise((resolve, reject) => {
    connectDB.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      var sql = `UPDATE hourglass_users SET wallet = wallet + ${fundAmount} WHERE phone = "${phone}"`;
      connectDB.query(sql, (err, result) => {
        connection.release();
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  });
};
module.exports = creditUser;
