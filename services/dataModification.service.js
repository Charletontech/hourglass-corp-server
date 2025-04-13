const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const sendMail = require("../utils/sendMail.util");

const dataModificationService = async ({
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  phoneNumber,
  homeAddress,
  localGovt,
  town,
  stateOfResidence,
  mothersName,
  mothersSurname,
  stateOfOrigin,
  localGovtOrigin,
  nin,
  dataModificationType,
  service,
  phone,
  name,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // set charge amount
      var charge;
      if (dataModificationType == "dob") {
        charge = 30000;
      } else {
        charge = 12000;
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
        [name, phone, service, dataModificationType],
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          }
        }
      );

      console.log({
        serviceRequested: service,
        Data_To_Modify: dataModificationType,
        phoneNumberRegisteredWith: phone,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        phoneNumber,
        homeAddress,
        localGovt,
        town,
        stateOfResidence,
        mothersName,
        mothersSurname,
        stateOfOrigin,
        localGovtOrigin,
        nin,
      });

      const mailSent = await sendMail(service, {
        serviceRequested: service,
        Data_To_Modify: dataModificationType,
        phoneNumberRegisteredWith: phone,
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        phoneNumber,
        homeAddress,
        localGovt,
        town,
        stateOfResidence,
        mothersName,
        mothersSurname,
        stateOfOrigin,
        localGovtOrigin,
        nin,
      });

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = dataModificationService;
