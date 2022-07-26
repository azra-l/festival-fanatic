const mongoose = require("mongoose");

const User = new mongoose.Schema({
  userId: String,
  saved: [String],
  archived: [String],
  selectedArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }]
});

module.exports = mongoose.model("User", User);
