const bcrypt = require("bcryptjs");
const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const getUser = async ({ password, phone }) => {
  return new Promise(async (resolve, reject) => {
    var sql = ORM.select("*", "hourglass_users", "phone", phone);
    connectDB.query(sql, async (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (!result || result.length === 0) {
        resolve("user not found");
      } else {
        const passwordCorrect = await checkPassword(result[0].password);
        passwordCorrect ? resolve(result) : resolve("incorrect password");
      }
    });
  });

  async function checkPassword(savedPassword) {
    const isMatch = await bcrypt.compare(password, savedPassword);
    if (!isMatch) {
      return false;
    }
    return true;
  }
};
module.exports = getUser;
