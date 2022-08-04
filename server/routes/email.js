var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

// Adapted from: https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  return transporter;
};

router.post("/", async function (req, res) {
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

  const transporter = await createTransporter();
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
