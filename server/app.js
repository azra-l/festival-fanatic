require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bandsInTownRouter = require('./routes/bandsintown');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


var app = express();

app.use(connectLiveReload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bandsintown', bandsInTownRouter);

module.exports = app;
