const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const sendMail = require("../utils/sendMail.util");

const ninDemographicService = async ({
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  phoneNumber,
  gender,
  service,
  phone,
  name,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Set charge amount
      const charge = 3500;

      // Check user balance
      const userBalance = await new Promise((resolve) => {
        const sql = ORM.select("wallet", "hourglass_users", "phone", phone);
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
          "Insufficient balance for this service. Please fund your wallet."
        );
        return;
      }

      // Debit user
      const debitSql = `UPDATE hourglass_users SET wallet = wallet - ${charge} WHERE phone = "${phone}"`;
      connectDB.query(debitSql, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
      });

      // save request data to database
      const saveNewRequest = await new Promise((resolve) => {
        var sql = ORM.insert("hourglass_request_list", [
          "name",
          "phone",
          "service",
        ]);
        connectDB.getConnection((err, connection) => {
          if (err) {
            reject(err);
            return;
          }
          connectDB.query(sql, [name, phone, service], (err) => {
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        });
      });

      //   check if saved successfully
      if (saveNewRequest) {
        resolve(`Request  for "${service}" successfully sent!`);
      }

      //   send mail notification to admin
      const mailSent = await sendMail(service, {
        serviceRequested: service,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        phoneNumber,
        gender,
        requestedBy: name,
        agentPhoneNumber: phone,
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
module.exports = ninDemographicService;
