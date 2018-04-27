require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index');
var session = require('express-session');
var util = require('./../helpers/user-status');
var cookieParser = require('cookie-parser');
var passport = require('passport');

// const worker = require('../workers/agenda-helper'); // chron job
require('dotenv').config();
const PORT = process.env.PORT || 3000;
// call express
const app = express();
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
