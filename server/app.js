require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const clientUrl = process.env.CLIENT_URL;

const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");

let isProd = process.env.NODE_ENV === "production";
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var festivalsRouter = require("./routes/festivals");
var bandsInTownRouter = require("./routes/bandsintown");
var artistRouter = require("./routes/artists");
var emailRouter = require("./routes/email");
var spotifyRouter = require('./routes/spotify');

if (!isProd) {
  var livereload = require("livereload");
  var connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

const restricted = require("./restricted-middleware");

mongoose
  .connect(process.env.MONGO_DB_CLUSTER, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to db");
  });

var app = express();
app.use(cors({ credentials: true, origin: [clientUrl] }));

if (!isProd) {
  app.use(connectLiveReload());
}

app.use(logger("dev"));
app.use(express.json());
app.set("trust proxy", 1);

// https://stackoverflow.com/questions/66503751/cross-domain-session-cookie-express-api-on-heroku-react-app-on-netlify
const sessionConfig = {
  name: "festivalFanaticSession",
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour maxage of a cookie (in milliseconds)
    // secure: true, // for production, set true for https only
    secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    // httpOnly: true, // true means no access from javascript
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
  },
  resave: false,
  saveUninitialized: true, // GDPR laws user has to give consent, needs to be false in production
};

app.use(session(sessionConfig));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", restricted, usersRouter);
app.use("/bandsintown", restricted, bandsInTownRouter);
app.use("/festivals", restricted, festivalsRouter);
app.use("/artists", restricted, artistRouter);
app.use("/email", restricted, emailRouter);
app.use('/spotify', restricted, spotifyRouter);

module.exports = app;
