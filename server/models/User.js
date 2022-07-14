const mongoose = require("mongoose");

const User = new mongoose.Schema({
  userId: String,
  festivals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Festival" }],
});

module.exports = mongoose.model("User", User);
