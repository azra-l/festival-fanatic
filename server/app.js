require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bandsInTownRouter = require('./routes/bandsintown');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
	setTimeout(() => {
		liveReloadServer.refresh("/");
	}, 100);
});

const restricted = require('./restricted-middleware')

mongoose
	.connect(process.env.MONGO_DB_CLUSTER, { useNewUrlParser: true })
	.then(() => {
		console.log('connected to db');
	})

var app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(connectLiveReload());

app.set('trust proxy', 1)
app.use(logger('dev'));
app.use(express.json());

const sessionConfig = {
	name: "festivalFanaticSession",
	secret: process.env.SESSION_SECRET,
	cookie: {
		maxAge: 1000 * 60 * 60, // 1 hour maxage of a cookie (in milliseconds)
		secure: false, // for production, set true for https only
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


module.exports = app;
