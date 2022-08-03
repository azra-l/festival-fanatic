var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");

// Adapted from: https://dev.to/jlong4223/how-to-implement-email-functionality-with-node-js-react-js-nodemailer-and-oauth2-2h7m

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

router.post("/", function (req, res) {
  const festivalName = req.body.name;
  const festivalLink = req.body.link;
  const festivalTickets = req.body.tickets;
  const senderName = req.body.sender;
  const receiverName = req.body.receiver;

  const subject = `${senderName} just shared an event with you!`;
  const body = `Hi ${receiverName}!\n\n ${senderName} shared an event with you, here are the details:\n Event: ${festivalName}\n Event Link: ${festivalLink}\n Get tickets here: ${festivalTickets}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.to,
    subject: subject,
    text: body,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
      res.status(500).send();
    } else {

      res.status(200).send();
    }
  });
});

module.exports = router;
