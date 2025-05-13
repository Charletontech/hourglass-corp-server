const bcrypt = require("bcryptjs");
const connectDB = require("../database/main.database");
const ORM = require("../database/CharlieDB");
const databaseErrorMail = require("../utils/databaseErrorMail.util");
const saveUserToDB = async (userData) => {
  return new Promise(async (resolve, reject) => {
    const { name, phone, email, password, address, lga, sor, businessName } =
      userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = ORM.insert("hourglass_users", [
      "name",
      "phone",
      "email",
      "password",
      "address",
      "lga",
      "sor",
      "businessName",
    ]);
    connectDB.query(
      sql,
      [name, phone, email, hashedPassword, address, lga, sor, businessName],
      (err, result) => {
        if (err) {
          reject(err);
          // databaseErrorMail(userData);
        } else {
          resolve(true);
          console.log("User successfully recorded.");
          console.log(result);
        }
      }
    );
  });
};
module.exports = saveUserToDB;
