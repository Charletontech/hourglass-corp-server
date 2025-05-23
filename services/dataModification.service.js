const fs = require("fs");
const path = require("path");
const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");
const sendMail = require("../utils/sendMail.util");
const deleteFile = require("../utils/deleteFile");

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
  pictureFile,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Set charge amount
      const charge = dataModificationType === "DateOfBirth" ? 43000 : 15000;

      // Check user balance
      const userBalance = await new Promise((resolve, reject) => {
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

      // Store request data in the database
      const insertSql = ORM.insert("hourglass_request_list", [
        "name",
        "phone",
        "service",
        "category",
      ]);
      connectDB.query(
        insertSql,
        [name, phone, service, dataModificationType],
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          }
        }
      );

      const filePath = pictureFile.path;
      // Send email with the uploaded file as an attachment
      const mailSent = await sendMail(
        service,
        {
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
        },
        filePath
      );

      resolve(true);
    } catch (error) {
      console.log(error);
      reject(error);
    } finally {
      // Clean up the uploaded file after sending the email
      deleteFile(pictureFile.path);
    }
  });
};

module.exports = dataModificationService;
