
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
const dotenv = require('dotenv');

const key_secret = require('./app/helpers/db-get-api-keys');
const compression = require('compression');
const cron = require('node-cron');
const moment = require('moment');
const reporter = require('./app/helpers/system-report');
const routines = require('./app/helpers/routines');

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
const validations = require('./app/routes/validations');
const batches = require('./app/routes/batches');
const calender = require('./app/routes/calender');
const partners = require('./app/routes/partners');
const straws = require('./app/routes/straws');
const orgs = require('./app/routes/orgs');
const stats = require('./app/routes/stats');
const graduation = require('./app/routes/graduation');
const background_processes = require('./app/routes/background_processes');
const reports = require('./app/routes/reports');
const weather = require('./app/routes/weather');

dotenv.config();


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
//app.use(bodyParser.json()); // parse requests of content-type - application/json
//app.use(bodyParser.urlencoded({ extended: true }));// parse requests of content-type - application/x-www-form-urlencoded

app.use(bodyParser.json({limit: '50mb'}));// parse requests of content-type - application/json
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));// parse requests of content-type - application/x-www-form-urlencoded

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});

app.use(morgan('combined', { stream: accessLogStream }));// setup the logger

// Routes
app.use('/', express.static(path.join(__dirname, '/')));
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
app.use('/', graduation);
app.use('/', background_processes);
app.use('/', validations);
app.use('/', reports);
app.use('/', weather);


/** NOTE: DEFAULT TIMEZONE IS America/Sao_Paulo .IT IS 3 HOURS BEHIND */
// Schedule daily tasks to run every day (Monday to Friday)
cron.schedule('0 6 * * 1-5', () => {reporter.sendReport(1);},{scheduled: true,timezone: "Africa/Nairobi"});//at 6:00 am.
cron.schedule('05 6 * * 1-5', () => {reporter.sendPraPerformanceReport(4);},{scheduled: true,timezone: "Africa/Nairobi"});//at 6:05 am.
cron.schedule('30 7 * * 1-5', () => {reporter.sendTagIdUnificationReport(7);},{scheduled: true,timezone: "Africa/Nairobi"});//at 7:30 am.
cron.schedule('45 7 * * 1-5', () => {reporter.sendGraduationReport(12,1,moment().format('YYYY-MM-DD'));},{scheduled: true,timezone: "Africa/Nairobi"});//at 7:45 am.
cron.schedule('0 0 * * 1-5', () => {routines.RunBackgroundProcesses();},{scheduled: true,timezone: "Africa/Nairobi"});//at 3:00 am.



// Schedule weekly tasks to run every Monday 
cron.schedule('30 6 * * 1', () => {reporter.sendReport(2);},{scheduled: true,timezone: "Africa/Nairobi"});// at 6:30 am.
cron.schedule('35 6 * * 1', () => {reporter.sendPraPerformanceReport(5);},{scheduled: true,timezone: "Africa/Nairobi"});// at 6:35 am.
cron.schedule('30 8 * * 1', () => {reporter.sendCountyPraPerformanceReport(10);},{scheduled: true,timezone: "Africa/Nairobi"});// at 8:30 am.
cron.schedule('45 8 * * 1', () => {reporter.sendGraduationReport(13,3,moment().subtract(2, 'days').format('YYYY-MM-DD'));},{scheduled: true,timezone: "Africa/Nairobi"});//at 8:45 am.

// Schedule monthly tasks to run 1st day of the month 
cron.schedule('0 7 1 * *', () => {reporter.sendReport(3);},{scheduled: true,timezone: "Africa/Nairobi"}); //at 7:00 am.
cron.schedule('05 7 1 * *', () => {reporter.sendPraPerformanceReport(6);},{scheduled: true,timezone: "Africa/Nairobi"}); //at 7:05 am.
cron.schedule('45 7 1 * *', () => {reporter.sendDataQualityReport(8);},{scheduled: true,timezone: "Africa/Nairobi"}); //at 7:45 am.
cron.schedule('0 8 1 * *', () => {reporter.sendComparativeDataQualityReport(9);},{scheduled: true,timezone: "Africa/Nairobi"}); //at 8:00 am.
cron.schedule('35 8 1 * *', () => {reporter.sendCountyPraPerformanceReport(11);},{scheduled: true,timezone: "Africa/Nairobi"}); //at 8:35 am.
cron.schedule('0 9 1 * *', () => {reporter.sendGraduationReport(13,4,moment().subtract(1, 'months').format('YYYY-MM-DD'));},{scheduled: true,timezone: "Africa/Nairobi"});//at 9:00 am.
cron.schedule('30 9 1 * *', () => {reporter.sendGraduationSummaryReport(14);},{scheduled: true,timezone: "Africa/Nairobi"});//at 9:30 am.


const PORT = process.env.PORT; // set port, listen for requests
const IP = '127.0.0.1'
app.listen(PORT,IP, () => {
  console.log(`Server is running on port ${PORT}.`);
});