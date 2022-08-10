var express = require("express");
var router = express.Router();
const Artist = require("../models/Artist");
const User = require("../models/User");

/* GET artist information. */
router.get("/info/:id", async function (req, res, next) {
  const result = await Artist.findOne({ _id: req.params.id }, {}, { lean: true });
  res.send(result);
});

router.get("/my-selected-artists", async function (req, res, next) {
  try {
    const userId = req.session.user.userId;
    const user = await User.findOne({ userId: userId });
    const selectedArtists = user.selectedArtists;
    const artistData = await Artist.find({ _id: { $in: selectedArtists } });
    res.status(200).send(artistData);
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: `unable to fetch matching festivals: ${error}` });
  }
});



router.delete("/", async function (req, res, next) {
  await Artist.collection.drop();
  res.status(204).send();
});

module.exports = router;
