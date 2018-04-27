require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index');
var session = require('express-session');
var util = require('./../helpers/user-status');
var cookieParser = require('cookie-parser');
var passport = require('passport');

if (process.env.START_CHRON === 'TRUE') {
  const worker = require('../workers/agenda-helper');
  const notifify = require('./../workers/notification-helper');
}

// const worker = require('../workers/agenda-helper'); // chron job
require('dotenv').config();
const PORT = process.env.PORT || 3000;
// call express
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET',
    'PUT',
    'POST',
    'DELETE',
    'OPTIONS'
  );
  next();
});

session;
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from ../client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

var users = require('./routes/user');
app.use('/api', users);

var community = require('./routes/loggedin');
app.use('/community', community);

var api = require('./routes/index');
app.use('/agendas', api);

app.get('*', util.checkUser, function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
  console.log('port is ', PORT);
});
