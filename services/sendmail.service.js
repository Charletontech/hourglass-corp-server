require("dotenv").config();
const nodemailer = require("nodemailer");
const sendMail = (formDetails, res) => {
  const { name, phone, leader, address, lga, sor } = formDetails;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "ukacharlie@gmail.com",
    subject: "NEW USER REGISTRATION",
    html: `
        <i style="font-size: 0.8rem">Dear Victoria,</i>
        <h2 style="color: #e47734">New user details:</h2>
        <p>Name: ${name}</p>
        <p>phone: ${phone}</p>
        <p>leader: ${leader}</p>
        <p>address: ${address}</p>
        <p>Local government: ${lga}</p>
        <p>State of Origin: ${sor}</p>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(501).json({
        message:
          "An error occurred (nodemailer), we are unable to register you. Kindly try again. Thank you.",
      });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({
        message: "You have been successfully registered. Welcome aboard!",
      });
    }
  });
};

module.exports = sendMail;

// const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

// const mailerSend = new MailerSend({
//   apiKey: process.env.API_KEY,
// });

// const sentFrom = new Sender("you@yourdomain.com", "Your name");

// const recipients = [new Recipient("your@client.com", "Your Client")];

// const emailParams = new EmailParams()
//   .setFrom(sentFrom)
//   .setTo(recipients)
//   .setReplyTo(sentFrom)
//   .setSubject("This is a Subject")
//   .setHtml("<strong>This is the HTML content</strong>")
//   .setText("This is the text content");

// await mailerSend.email.send(emailParams);

