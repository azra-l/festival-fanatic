require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const clientUrl = process.env.CLIENT_URL;


const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session')

let isProd = process.env.NODE_ENV === 'production';
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var festivalsRouter = require('./routes/festivals');
var bandsInTownRouter = require('./routes/bandsintown');
var artistRouter = require('./routes/artists');

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


const restricted = require('./restricted-middleware')

mongoose
	.connect(process.env.MONGO_DB_CLUSTER, { useNewUrlParser: true })
	.then(() => {
		console.log('connected to db');
	})

var app = express();
app.use(cors({ credentials: true, origin: clientUrl }));

if (!isProd) {
  app.use(connectLiveReload());
}

app.use(logger('dev'));
app.use(express.json());
app.set('trust proxy', 1);
const sessionConfig = {
	name: "festivalFanaticSession",
	secret: process.env.SESSION_SECRET,
	cookie: {
		maxAge: 1000 * 60 * 60, // 1 hour maxage of a cookie (in milliseconds)
		secure: isProd, // for production, set true for https only
		httpOnly: true, // true means no access from javascript
	},
	resave: false,
	saveUninitialized: true // GDPR laws user has to give consent, needs to be false in production
}

app.use(session(sessionConfig))

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', restricted, usersRouter);
app.use('/bandsintown', restricted, bandsInTownRouter);
app.use('/festivals', restricted, festivalsRouter);
app.use('/artists', restricted, artistRouter);


module.exports = app;
