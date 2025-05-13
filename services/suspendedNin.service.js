const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const sendMail = require("../utils/sendMail.util");

const suspendedNinService = async ({ phone, name, nin, service }) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      var charge = 5000;
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
      ]);
      connectDB.query(sql, [name, phone, service], (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
      });

      const mailSent = await sendMail(service, {
        serviceRequested: service,
        nin,
        phone,
      });

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = suspendedNinService;
