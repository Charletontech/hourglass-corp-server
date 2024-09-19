const sendMail = require("../services/sendmail.service");

const signUpHandler = (req, res) => {
  sendMail(req.body, res);
};

module.exports = { signUpHandler };
