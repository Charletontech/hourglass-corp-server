const sendMail = require("../services/sendmail.service");
const createAccount = require("../services/createAccount.service");
const saveAccountToDB = require("../services/saveAccountToDB.service");
const connectDB = require("../database/main.database");
const ORM = require("../database/CharlieDB");
const vetEmptyFields = require("../services/vetEmptyFields.webhook.service");
const findAccountNumber = require("../services/findAccountNumber.service");
const vetSettlementID = require("../services/vetSettlementID.service");
const addTransactionToDB = require("../services/addTransactionToDB.service");

const initDBHandler = (req, res) => {
  var sql =
    "CREATE TABLE IF NOT EXISTS hourglass_users (id INT AUTO_INCREMENT PRIMARY KEY, accountNo VARCHAR(15), accountName VARCHAR(255) )";
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });

  var sql =
    "CREATE TABLE IF NOT EXISTS hourglass_transactions (id INT AUTO_INCREMENT PRIMARY KEY, accountNo VARCHAR(15), settlementID VARCHAR(50), transTimeDate VARCHAR(15), transactionAmount VARCHAR(20) )";
  connectDB.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  res.json("database initialized and ready!");
};

const signUpHandler = async (req, res) => {
  const accountDetails = await createAccount(req.body, res);
  if (accountDetails.requestSuccessful === true) {
    sendMail(req.body, res, accountDetails);
    saveAccountToDB(accountDetails);
  } else {
    console.log(`Bank API response: ${accountDetails.responseMessage}`);
    res.status(500).json({
      message: `Error: failed to generate account number at this time. ERLOCATION: controller.js, APIRESPONSE: ${accountDetails.responseMessage}`,
    });
  }
};

const webhookHandler = async (req, res) => {
  const payload = req.body;

  // check payload for empty fields
  var fieldIsEmpty = vetEmptyFields(payload);
  if (fieldIsEmpty) {
    res.json({
      requestSuccessful: true,
      sessionId: "99990000554443332221",
      responseMessage: "rejected transaction",
      responseCode: "02",
    });
    return;
  }

  // check if acct exists in DB
  const accountExists = await findAccountNumber(payload.accountNumber, res);
  if (!accountExists) {
    res.json({
      requestSuccessful: true,
      sessionId: "99990000554443332221",
      responseMessage: "rejected transaction",
      responseCode: "02",
    });
    return;
  }

  // check if settlementID already exists
   const settlementIDexists = await vetSettlementID(payload.settlementId);
  if (settlementIDexists) {
    res.json({
      requestSuccessful: true,
      sessionId: "99990000554443332221",
      responseMessage: "duplicate transaction",
      responseCode: "01",
    });
    return;
  } else {
    addTransactionToDB(payload);
  }
  
  // authenticate x-auth-signature
  const xAuthSignatureHeader = req.headers["x-auth-signature"];
  if (
    !xAuthSignatureHeader ||
    xAuthSignatureHeader !== process.env.X_SIGNATURE
  ) {
    res.json({
      requestSuccessful: true,
      sessionId: "99990000554443332221",
      responseMessage: "rejected transaction",
      responseCode: "02",
    });
    return;
  }

  res.json({
    requestSuccessful: true,
    sessionId: "99990000554443332221",
    responseMessage: "success",
    responseCode: "00",
  });
};

const refreshHandler = (req, res) => {
  console.log("server has been refreshed!");
};

module.exports = {
  signUpHandler,
  refreshHandler,
  webhookHandler,
  initDBHandler,
};
