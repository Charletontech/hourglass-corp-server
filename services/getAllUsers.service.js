const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const getAllUsersService = async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      connectDB.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }
        const sql = ORM.select("*", "hourglass_users");
        connectDB.query(sql, (err, result) => {
          connection.release();
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
    reject(error);
  }
};
module.exports = getAllUsersService;
