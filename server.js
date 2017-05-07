// require('events').EventEmitter.prototype._maxListeners = 0;
require('events').EventEmitter.defaultMaxListeners = Infinity;

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var mongoose = require('./config/mongoose'),
 	express = require('./config/express'),
 	cron = require('node-cron'),
 	async = require('async'),

 	// jobs to get reviews
 	// walmartJob = require('./app/jobs/walmart.server.job.js'),
 	// ricardoJob = require('./app/jobs/ricardo_eletro.server.job.js'),
 	// colomboJob = require('./app/jobs/lojas_colombo.server.job.js'),
 	// pontoFrioJob = require('./app/jobs/ponto_frio.server.job.js');
 	// girafaJob = require('./app/jobs/girafa.server.job.js');
 	// extraJob = require('./app/jobs/extra.server.job.js');
 	// casasBahiaJob = require('./app/jobs/casas_bahia.server.job.js');
 	allJobs = require('./app/jobs/all.server.job.js');

var db = mongoose();
var app = express();



//app.listen(3000);
var server_port;

if(process.env.NODE_ENV == 'production'){
	server_port = process.env.PORT || 80;
}else{
	server_port = 3000;
}

app.listen(server_port,function() {
    console.log('Server runnning on port %d', server_port);
});



// jobs to get reviews
// walmartJob.starJob();
// ricardoJob.starJob();
// colomboJob.starJob();
// pontoFrioJob.starJob();
// girafaJob.starJob();
// extraJob.starJob();
// casasBahiaJob.starJob();
// casasBahiaJob.starJob();
allJobs.starJob();

module.exports = app;

