var express = require("express");
var router = express.Router();
const sgMail = require("@sendgrid/mail");
const getHtmlContent = require("../utils/emailHtmlContent");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async function (req, res) {
  const festivalName = req.body.name;
  const festivalLink = req.body.link;
  const festivalTickets = req.body.tickets;
  const festivalDate = req.body.date;
  const senderName = req.body.sender;
  const receiverName = req.body.receiver;

  const subject = `${senderName} just shared an event with you!`;
  const html = getHtmlContent(receiverName, senderName, festivalName, festivalDate, festivalLink, festivalTickets);

  const msg = {
    to: req.body.to,
    from: "festivalfanatic@stanfordlin.com",
    subject: subject,
    html: html,
  };

  sgMail
    .send(msg)
    .then((response) => {
      res.status(200).send();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send();
    });
});

module.exports = router;
