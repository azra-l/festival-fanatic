var express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET festivals that star artists in user's selectedArtist lineup*/
router.get("/", async function (req, res, next) {
const userIdFromSession = req.session.user.userId
  const user = await User.findOne({ userId: userIdFromSession });
  const selectedArtists = user.selectedArtists;
  res.send(selectedArtists);
});

module.exports = router;
