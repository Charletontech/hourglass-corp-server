const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const checkExistingUser = async (phone) => {
  return new Promise((resolve, reject) => {
    var sql = ORM.select("*", "hourglass_users", "phone", phone);
    connectDB.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }

      if (result[0]?.phone == phone) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};
module.exports = checkExistingUser;
