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
  artistRef: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
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

const SpotifyImports = new mongoose.Schema({
  userId: String,
  timeOfImport: Date,
  spotifyImports: [SpotifyArtistSchema]
});

module.exports = mongoose.model("SpotifyImports", SpotifyImports);
