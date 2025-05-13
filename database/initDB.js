const connectDB = require("./main.database");

const initDB = () => {
  var sql =
    "CREATE TABLE IF NOT EXISTS hourglass_users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200), phone VARCHAR(100), email VARCHAR(100), wallet INT DEFAULT 0, password VARCHAR(100), address VARCHAR(255), lga VARCHAR(200), sor VARCHAR(200), businessName VARCHAR(200),  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )";
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  var sql =
    "CREATE TABLE IF NOT EXISTS hourglass_request_list (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200), phone VARCHAR(100), service VARCHAR(100), category VARCHAR(100) DEFAULT null, status VARCHAR(100) DEFAULT 'pending')";
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  var sql = `
  CREATE TABLE IF NOT EXISTS data_modification_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100),
    middleName VARCHAR(100),
    lastName VARCHAR(100),
    dateOfBirth DATE,
    phoneNumber VARCHAR(20),
    homeAddress VARCHAR(255),
    localGovt VARCHAR(100),
    town VARCHAR(100),
    stateOfResidence VARCHAR(100),
    mothersName VARCHAR(100),
    mothersSurname VARCHAR(100),
    stateOfOrigin VARCHAR(100),
    localGovtOrigin VARCHAR(100),
    nin VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Table created or already exists:", result);
  });
};
module.exports = initDB;
