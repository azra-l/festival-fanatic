var express = require("express");
var router = express.Router();
var mailgun = require("mailgun-js");

router.post("/", async function (req, res) {
  const festivalName = req.body.name;
  const festivalLink = req.body.link;
  const festivalTickets = req.body.tickets;
  const senderName = req.body.sender;
  const receiverName = req.body.receiver;

  const subject = `${senderName} just shared an event with you!`;
  const text = `Hi ${receiverName}!\n\n ${senderName} shared an event with you, here are the details:\n Event: ${festivalName}\n Event Link: ${festivalLink}\n Get tickets here: ${festivalTickets}`;

  const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
  const data = {
    from: process.env.MAILGUN_EMAIL,
    to: req.body.to,
    subject: subject,
    text: text,
  };
  mg.messages().send(data, function (error, body) {
    if(error){
      res.status(500).send();
    } else {
      res.status(200).send();
    }
  });
});

module.exports = router;
