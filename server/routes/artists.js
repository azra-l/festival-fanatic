var express = require("express");
var router = express.Router();
const Artist = require("../models/Artist");

/* GET artist information. */
router.get("/:id", async function (req, res, next) {
  const result = await Artist.findOne({_id: req.body.id});
  res.send(result);
});


module.exports = router;
