const mongoose = require("mongoose");

const SpotifyArtistFollowersSchema = new mongoose.Schema({
  href: String,
  total: Number
});

const SpotifyArtistImageSchema = new mongoose.Schema({
  height: Number,
  width: Number,
  url: String
});

const SpotifyArtistSchema = new mongoose.Schema({
  followers: {
    type: SpotifyArtistFollowersSchema
  },
  genres: [String],
  href: String,
  id: String,
  images: [{
    type: SpotifyArtistImageSchema
  }],
  name: String,
  popularity: Number,
  type: String,
  uri: String
});

const User = new mongoose.Schema({
  userId: String,
  saved: [String],
  archived: [String],
  spotifyImports: {
    type: Map,
    of: [SpotifyArtistSchema],
    default: {}
  }
});

module.exports = mongoose.model("User", User);
