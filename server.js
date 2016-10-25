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


var dns = require('native-dns');
var server = dns.createServer();

server.on('request', function (request, response) {
  //console.log(request)
  response.answer.push(dns.A({
    name: request.question[0].name,
    address: '127.0.0.1',
    ttl: 600,
  }));
  response.answer.push(dns.A({
    name: request.question[0].name,
    address: '127.0.0.2',
    ttl: 600,
  }));
  response.additional.push(dns.A({
    name: 'www.ricardoeletro.com.br',
    address: '189.125.79.178',
    ttl: 299,
  }));
  response.additional.push(dns.A({
    name: 'www.ricardoeletro.com.br',
    address: '189.125.79.60',
    ttl: 299,
  }));
  response.additional.push(dns.A({
    name: 'www.ricardoeletro.com.br',
    address: '189.125.79.56',
    ttl: 299,
  }));
  response.additional.push(dns.A({
    name: 'www.ricardoeletro.com.br',
    address: '189.125.79.54',
    ttl: 299,
  }));
  response.send();
});

server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

server.serve(15353);



module.exports = app;

