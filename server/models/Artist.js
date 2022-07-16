const mongoose = require("mongoose");

const Artist = new mongoose.Schema({
  name: String,
  external_urls: String,
  id: String,
});

module.exports = mongoose.model("Artist", Artist);
