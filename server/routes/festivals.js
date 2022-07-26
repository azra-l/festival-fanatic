var express = require("express");
const Festival = require("../models/Festival");
var router = express.Router();
const User = require("../models/User");

/**
 * TODO need to include computed value of the length of intersection between artists and selectedArtists
 * This will allow sorting to happen on the database side, and also allow pagination for query optimization 
 * 
 * GET festivals that star artists in user's selectedArtist lineup
 **/ 
router.get("/matched", async function (req, res, next) {
  try {
    const userId = req.session.user.userId
    const user = await User.findOne({ userId: userId });
    const selectedArtists = user.selectedArtists;
    const matchingFestivals = await Festival.find({ artists: { $in: selectedArtists }});
  res.send(matchingFestivals);
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: `unable to fetch matching festivals: ${error}` })
  }
});

module.exports = router;
