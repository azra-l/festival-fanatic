import { Schema } from "mongoose";

const Artist = new Schema({
  name: String,
  external_urls: String,
  id: String,
});

const Festival = new Schema({
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
  artists: [Artist],
});

const User = new Schema({
  userId: String,
  festivals: [Festival],
});

module.exports = User;
