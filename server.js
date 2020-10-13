
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const helmet = require('helmet');
const  morgan = require('morgan'); // logging HTTP requests in the Express framework
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream') ;
const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const key_secret = require('./app/helpers/db-get-api-keys');
const compression = require('compression');

// import Routes
const animal = require('./app/routes/animal');
const index = require('./app/routes/index');
const farm = require('./app/routes/farm');
const country = require('./app/routes/country');
const user = require('./app/routes/user');
const dropdown_utility= require('./app/routes/dropdown_utility');
const clients = require('./app/routes/clients');
const lookup = require('./app/routes/lookup');
const herds = require('./app/routes/herds');
const events = require('./app/routes/events');
const parameters = require('./app/routes/parameters');
const batches = require('./app/routes/batches');
const calender = require('./app/routes/calender');
const partners = require('./app/routes/partners');
const straws = require('./app/routes/straws');
const orgs = require('./app/routes/orgs');
const stats = require('./app/routes/stats');

passport.use(new Strategy(
  function(username, password, cb) {
    key_secret.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


app.use(compression()); //Compress all routes
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers
app.use(cors()); // Enable Cross-origin resource sharing (CORS)
app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true }));// parse requests of content-type - application/x-www-form-urlencoded

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});

app.use(morgan('combined', { stream: accessLogStream }));// setup the logger

// Routes
app.use('/',passport.authenticate('basic', { session: false }), animal);
app.use('/', index);
app.use('/', farm);
app.use('/', country);
app.use('/', user);
app.use('/', dropdown_utility);
app.use('/', lookup);
app.use('/', clients);
app.use('/', herds);
app.use('/', events);
app.use('/', parameters);
app.use('/', batches);
app.use('/', calender);
app.use('/', partners);
app.use('/', straws);
app.use('/', orgs);
app.use('/', stats);

const PORT = process.env.PORT || 8080; // set port, listen for requests
const IP = '127.0.0.1'
app.listen(PORT,IP, () => {
  console.log(`Server is running on port ${PORT}.`);
});