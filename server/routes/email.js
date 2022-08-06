var express = require("express");
var router = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async function (req, res) {
  const festivalName = req.body.name;
  const festivalLink = req.body.link;
  const festivalTickets = req.body.tickets;
  const festivalDate = req.body.date;
  const senderName = req.body.sender;
  const receiverName = req.body.receiver;

  const subject = `${senderName} just shared an event with you!`;
  const text = `Hi ${receiverName}!\n\n ${senderName} shared an event with you, here are the details:\nEvent: ${festivalName}\nDate: ${festivalDate}\n Event Link: ${festivalLink}\n Get tickets here: ${festivalTickets}`;

  const msg = {
    to: req.body.to, 
    from: 'festivalfanatic@stanfordlin.com',
    subject: subject,
    text: text,
  }

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
      res.status(200).send();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

module.exports = router;
