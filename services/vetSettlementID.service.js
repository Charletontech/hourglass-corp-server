const connectDB = require("../database/main.database");
const ORM = require("../database/CharlieDB");

const vetSettlementID = async (settlementId, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      var sql = ORM.select(
        "settlementID",
        "hourglass_transactions",
        "settlementID",
        settlementId
      );
      connectDB.query(sql, (err, result) => {
        if (err) {
          res.json({
            requestSuccessful: true,
            sessionId: "99990000554443332221",
            responseMessage: "system failure, retry",
            responseCode: "03",
          });
          reject(new Error("Error querying database for settlementID"));
        }
        if (result.length !== 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } catch (error) {
      reject(new Error("Error querying database for settlementID"));
    }
  });
};
module.exports = vetSettlementID;
