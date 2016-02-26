/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
// var mongoose = require('mongoose');
var config = require('./config/environment');
var router = express.Router();
var cors = require('cors');



// Connect to database
// mongoose.connect(config.mongo.uri, config.mongo.options);
// mongoose.connection.on('error', function(err) {
// 	console.error('MongoDB connection error: ' + err);
// 	process.exit(-1);
// 	}
// );
// Populate DB with sample data
// if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();



app.use(cors());

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

 var cfg = {
 	port: "9000",
 	ip: "0.0.0.0"
 }
 var https_config = {
   port: "8000",
   ip: "0.0.0.0"
 }

 router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8000');

    next();
});

app.all('/*', function (req, res, next) {
	console.log('enabling cors..');
	res.header("Access-Control-Allow-Origin", "*");
	 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	 res.header("Access-Control-Allow-Headers", "X-Requested-With");
			 next();
});

app.use(function(req, res, next) {
	console.log('enabling cors in use..');

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

//  server.listen(cfg.port, cfg.ip, function () {
// Start server
// server.listen(config.port, config.ip, function () {
server.listen(cfg.port, cfg.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});


/**HTTPS*/
// var fs = require('fs');
// var https = require('https');
// var privateKey  = fs.readFileSync('/opt/certs/localhost:9000.key', 'utf8');
// var certificate = fs.readFileSync('/opt/certs/localhost:9000.crt', 'utf8');
//
// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(https_config.port, https_config.ip, function(){
//   console.log('Express server(https) listening on %d, in %s mode', https_config.port, app.get('env'));
// });

// Expose app
exports = module.exports = app;
