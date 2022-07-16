const mongoose = require("mongoose");

const Festival = new mongoose.Schema({
  id: String,
  date: String,
  name: String,
  city: String,
  region: String,
  country: String,
  venue: String,
  latitude: String,
  longituse: String,
  saved: Boolean,
  archived: Boolean,
  tickets: String,
  link: String,
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
});

module.exports = mongoose.model("Festival", Festival);
