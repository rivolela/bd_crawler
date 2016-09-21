process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var mongoose = require('./config/mongoose'),
 	express = require('./config/express');
 	cron = require('node-cron');
 	zanoxJob = require('./app/jobs/zanox.server.job.js');
 	walmartJob = require('./app/jobs/walmart.server.job.js');

var db = mongoose();
var app = express();

//app.listen(3000);

var taskZanox_01 = cron.schedule('00 16 * * *', function(err){
  console.log('starting zanox job ...');
  zanoxJob.start(function(){
  	console.log("job zanox finished !")
  });
},false);

var taskWalmart_01 = cron.schedule('10 16 * * *', function(err){
  console.log('starting zanox job ...');
  walmartJob.start(function(){
  	console.log("walmart zanox finished !");
  });
},false);

taskZanox_01.start();
taskWalmart_01.start();


module.exports = app;

//console.log('Server runnning at http://localhost:3000/');