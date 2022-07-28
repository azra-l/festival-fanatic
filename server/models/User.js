const mongoose = require("mongoose");

const User = new mongoose.Schema({
  userId: String,
  saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Festival" }],
  archived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Festival" }],
  selectedArtists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }]
});

module.exports = mongoose.model("User", User);
