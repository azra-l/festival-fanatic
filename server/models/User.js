const mongoose = require("mongoose");

const User = new mongoose.Schema({
  userId: String,
  festivals: [
    {
      id: String,
      date: String,
      name: String,
      city: String,
      region: String,
      country: String,
      venue: String,
      latitude: String,
      longitude: String,
      saved: Boolean,
      archived: Boolean,
      tickets: String,
      link: String,
      artists: [{
        name: String,
        external_urls: String,
        id: String,
      }]
    },
  ],
});

module.exports = mongoose.model("User", User);
