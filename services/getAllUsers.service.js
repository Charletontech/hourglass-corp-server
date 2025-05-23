const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const getAllUsersService = async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      const sql = ORM.select("*", "hourglass_users");
      connectDB.query(sql, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
      delay(500);
    });
  } catch (error) {
    console.log(error);
    reject(error);
  }
};
module.exports = getAllUsersService;
