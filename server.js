process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var mongoose = require('./config/mongoose'),
 	express = require('./config/express'),
 	cron = require('node-cron'),
 	// job to get offer
 	zanoxJob = require('./app/jobs/zanox.server.job.js'),
 	// jobs to get reviews
 	walmartJob = require('./app/jobs/walmart.server.job.js'),
 	ricardoJob = require('./app/jobs/ricardo_eletro.server.job.js'),
 	colomboJob = require('./app/jobs/lojas_colombo.server.job.js');
 	async = require('async');

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


// job to get offer
zanoxJob.starJob();

// jobs to get reviews
walmartJob.starJob();
ricardoJob.starJob();
colomboJob.starJob();


module.exports = app;

