var express = require("express");
var router = express.Router();
const User = require("../models/User");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const result = await User.find();
  res.send(result);
});

router.delete("/", async function (req, res, next) {
  await User.collection.drop();
  res.status(204).send();
});

/* GET  specific user */
router.get("/:id", async function (req, res, next) {
  const user = await User.findOne({ userId: req.params.id });

  if (!user) {
    res.status(404).send("That user does not exist");
  } else {
    res.send(user);
  }
});

/* PATCH Festival */
router.patch("/:id", async function (req, res, next) {
  const festivalId = req.body.id;
  const dataToUpdate = req.body;
  // https://www.mongodb.com/community/forums/t/updating-a-nested-object-in-a-document-using-mongoose/141865
  try {
    const updated = await User.findOneAndUpdate(
      { userId: req.params.id, "festivals.id": festivalId },
      { $set: { "festivals.$": dataToUpdate } },
      {new: true},
    );
      if(!updated){
        res.status(404).send();
      } else {
        res.send(updated);
      }
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
