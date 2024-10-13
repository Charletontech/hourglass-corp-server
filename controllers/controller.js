const sendMail = require("../services/sendmail.service");
const createAccount = require("../services/createAccount.service");

const signUpHandler = async (req, res) => {
  const accountDetails = await createAccount(req.body);
  if (accountDetails.requestSuccessful === true) {
    sendMail(req.body, res, accountDetails);
  } else {
    console.log(`Bank API response: ${accountDetails.responseMessage}`);
    res.status(500).json({
      message: `Error: failed to generate account number at this time. ERLOCATION: controller.js, APIRESPONSE: ${accountDetails.responseMessage}`,
    });
  }
};

const refreshHandler = (req, res) => {
  console.log("server has been refreshed!");
};

module.exports = { signUpHandler, refreshHandler };
