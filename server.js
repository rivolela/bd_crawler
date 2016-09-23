process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var mongoose = require('./config/mongoose'),
 	express = require('./config/express');
 	cron = require('node-cron');
 	zanoxJob = require('./app/jobs/zanox.server.job.js');
 	walmartJob = require('./app/jobs/walmart.server.job.js');

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


var taskZanox_01 = cron.schedule('29 11 * * *', function(err){
  console.log('starting zanox job ...');
  var url = null;
  zanoxJob.start(url,function(){
  	console.log("job zanox finished !");
  });
},false);


var taskWalmart_01 = cron.schedule('35 16 * * *', function(err){
  console.log('starting walmart job ...');
  walmartJob.start(function(){
  	console.log("walmart zanox finished !");
  });
},false);


taskZanox_01.start();
taskWalmart_01.start();


module.exports = app;

//console.log('Server runnning at http://localhost:3000/');