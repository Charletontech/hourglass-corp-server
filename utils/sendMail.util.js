require("dotenv").config();
const nodemailer = require("nodemailer");
const sendMail = async (subject, formDetails, attachmentFilePath) => {
  return new Promise((resolve, reject) => {
    // create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // construct the html body dynamically
    var html = `
    <i style="font-size: 0.8rem">Dear Victoria,</i>
    <h2 style="color: #e47734">New user details:</h2>
    `;
    Object.entries(formDetails).forEach((element) => {
      html += `<p>${element[0]}: ${element[1]}</p>`;
    });

    // structure mail options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.FIXED_RECIPIENT,
      subject: `NEW ${subject.toUpperCase()} REQUEST`,
      html,
    };

    // add attachment if provided
    if (attachmentFilePath) {
      mailOptions.attachments = [
        {
          filename: attachmentFilePath.split("/").pop(),
          path: attachmentFilePath,
        },
      ];
    }

    // send mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(true);
      }
    });
  });
};

module.exports = sendMail;
