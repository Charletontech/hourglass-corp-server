require("dotenv").config();
const nodemailer = require("nodemailer");
const databaseErrorMail = (accountDetails) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.FIXED_RECIPIENT,
    subject: "DATABASE ERROR IN HOURGLASS",
    html: `
        <i style="font-size: 0.8rem">Dear Victoria,</i>
        <h2 style="color: #e47734">The following user was not able to be saved in the database:</h2>
        <br>
        <b>Account Details<b/>
        <p>Name: ${accountDetails.account_name}</p>
        <p>Account Number: ${accountDetails.account_number}<p/>
        <br>
        <i style="font-size: 0.8rem">Kindly inform the developer.</i>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(
        "Unable to send database error mail. ERLOCATION: databaseErrorMail.util.js. ",
        error
      );
    } else {
      console.log("Database error mail sent: " + info.response);
    }
  });
};

module.exports = databaseErrorMail;
