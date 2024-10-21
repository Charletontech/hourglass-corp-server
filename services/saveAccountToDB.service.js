const connectDB = require("../database/main.database");
const ORM = require("../database/CharlieDB");
const databaseErrorMail = require("../utils/databaseErrorMail.util");
const saveAccountToDB = (accountDetails) => {
  // accountDetails.account_name
  // accountDetails.account_number
  const sql = ORM.insert("hourglass_users", ["accountNo", "accountName"]);
  connectDB.query(
    sql,
    [accountDetails.account_number, accountDetails.account_name],
    (err, result) => {
      if (err) {
        databaseErrorMail(accountDetails);
        console.log(err);
      } else {
        console.log("User successfully recorded.");
      }
    }
  );
};
module.exports = saveAccountToDB;
