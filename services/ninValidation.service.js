const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const sendMail = require("../utils/sendMail.util");

const ninValidationService = async ({
  ninValidationType,
  nin,
  service,
  phone,
  user,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // set charge amount
      var charge;
      if (ninValidationType == "vnin" || ninValidationType == "bank") {
        charge = 1500;
      } else {
        charge = 2000;
      }

      // check user balance
      const userBalance = await new Promise((resolve, reject) => {
        var sql = ORM.select("wallet", "hourglass_users", "phone", phone);
        connectDB.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(result[0].wallet);
          }
        });
      });
      if (charge > userBalance) {
        reject(
          "insufficient balance for this service. Please fund your wallet."
        );
        return;
      } else {
        // debit user
        var sql = `UPDATE hourglass_users SET wallet = wallet - ${charge} WHERE phone = "${phone}"`;
        connectDB.query(sql, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          }
        });
      }

      // store request data in database
      var sql = ORM.insert("hourglass_request_list", [
        "name",
        "phone",
        "service",
        "category",
      ]);
      connectDB.query(
        sql,
        [user, phone, service, ninValidationType],
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          }
        }
      );

      const mailSent = await sendMail(service, {
        ninValidationType,
        nin,
        service,
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = ninValidationService;
