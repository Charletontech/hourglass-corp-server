const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const updateBalanceService = async ({ phone, newBalance }) => {
  return new Promise((resolve, reject) => {
    const sql = ORM.update(
      "hourglass_users",
      "wallet",
      newBalance,
      "phone",
      phone
    );
    connectDB.query(sql, [newBalance, phone], (error, results) => {
      if (error) {
        console.error("Error updating balance:", error);
        return reject(error);
      }
      if (results.affectedRows === 0) {
        return reject(
          new Error("No rows updated. Check if the phone number exists.")
        );
      }
      resolve(results);
    });
  });
};
module.exports = updateBalanceService;
