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
    const userId = req.session.user.userId;
    const user = await User.findOne({ userId: userId });
    const selectedArtists = user.selectedArtists;
    const matchingFestivals = await Festival.find({
      artists: { $in: selectedArtists },
    });
    res.send(matchingFestivals);
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: `unable to fetch matching festivals: ${error}` });
  }
});

/** GET all the user's festivals including new matches, saved and archived festivals */
router.get("/", async function (req, res, next) {
  try {
    const userId = req.session.user.userId;
    const user = await User.findOne({ userId: userId });
    const selectedArtists = user.selectedArtists;
    const matchingFestivals = await Festival.find({
      artists: { $in: selectedArtists },
    },{}, {lean: true});
    const userSavedList = user.saved;
    let savedFestivals = await Festival.find({ _id: { $in: userSavedList } }, {}, {lean: true});
    const archivedList = user.archived;
    let archivedFestivals = await Festival.find({ _id: { $in: archivedList } }, {}, {lean:true});
    savedFestivals = savedFestivals.map(festival => ({...festival, saved: true}));
    archivedFestivals = archivedFestivals.map(festival => ({...festival, archived: true}));
    // https://stackoverflow.com/questions/46849286/merge-two-array-of-objects-based-on-a-key
    const map = new Map();
    matchingFestivals.forEach((festival) => map.set(festival.id, festival));
    savedFestivals.forEach(festival => map.set(festival.id, {...map.get(festival.id), ...festival}));
    archivedFestivals.forEach(festival => map.set(festival.id, {...map.get(festival.id), ...festival}));
    const mergedArr = Array.from(map.values());

    mergedArr.forEach((festival) => {
      if(!festival.saved) {
        festival.saved = false;
      }
      if(! festival.archived) {
        festival.archived = false;
      }
    })
    res.send(mergedArr);
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: `unable to fetch matching festivals: ${error}` });
  }
});

router.get("/saved", async function (req, res, next) {
  try {
    const userId = req.session.user.userId;
    const user = await User.findOne({ userId: userId });
    const userSavedList = user.saved;
    const savedFestivals = await Festival.find({ _id: { $in: userSavedList } });
    res.send(savedFestivals);
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: `unable to fetch matching festivals: ${error}` });
  }
});

module.exports = router;
