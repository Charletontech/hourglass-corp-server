const sendMail = require("../services/sendmail.service");

const signUpHandler = (req, res) => {
  sendMail(req.body, res);
};

const refreshHandler = (req, res) => {
  console.log("server has been refreshed!");
};

module.exports = { signUpHandler, refreshHandler };
