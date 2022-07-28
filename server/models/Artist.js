const mongoose = require("mongoose");

const Artist = new mongoose.Schema({
  name: String,
  spotify_id: String,
  bandintown_id: String,
  href: String,
  image: String,
});

module.exports = mongoose.model("Artist", Artist);
