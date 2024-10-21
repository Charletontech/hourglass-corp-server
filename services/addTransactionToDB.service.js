const connectDB = require("../database/main.database");
const ORM = require("../database/CharlieDB");

const addTransactionToDB = (payload, res) => {
  const { accountNumber, settlementId, tranDateTime, transactionAmount } =
    payload;
  console.log(accountNumber, settlementId, tranDateTime, transactionAmount);
  var sql = ORM.insert("hourglass_transactions", [
    "accountNo",
    "settlementID",
    "transTimeDate",
    "transactionAmount",
  ]);
  connectDB.query(
    sql,
    [accountNumber, settlementId, tranDateTime, transactionAmount],
    (err, result) => {
      try {
        if (err) {
          res.json({
            requestSuccessful: true,
            sessionId: "99990000554443332221",
            responseMessage: "system failure, retry",
            responseCode: "03",
          });
          throw new Error("Error adding transaction details to database");
        }
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  );
};

module.exports = addTransactionToDB;
