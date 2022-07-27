var express = require("express");
var router = express.Router();
const Artist = require("../models/Artist");

/* GET artist information. */
router.get("/:id", async function (req, res, next) {
  const result = await Artist.findOne({_id: req.params.id}, {}, {lean: true});
  console.log(result);
  res.send(result);
});

router.delete("/", async function (req, res, next) {
    await Artist.collection.drop();
    res.status(204).send();
  });

module.exports = router;
