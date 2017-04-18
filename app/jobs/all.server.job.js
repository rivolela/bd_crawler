var config = require('../../config/config.js'),
	Jobs = require('../../config/jobs/jobs.config.js'),
 	cbController = require('../controllers/casas_bahia.server.controller.js'),
 	offerController = require('../controllers/offer.crawler.server.controller.js'),
 	DateUtile = require('../utile/date.server.utile.js'),
 	cron = require('node-cron'),
 	async = require('async'),
 	walmartJob = require('./walmart.server.job.js'),
 	ricardoJob = require('./ricardo_eletro.server.job.js'),
 	colomboJob = require('./lojas_colombo.server.job.js'),
 	pontoFrioJob = require('./ponto_frio.server.job.js'),
 	girafaJob = require('./girafa.server.job.js'),
 	extraJob = require('./extra.server.job.js'),
 	casasBahiaJob = require('./casas_bahia.server.job.js');



// if(process.env.NODE_ENV == 'test_job'){
// 	start(function(){
// 		console.log("end test lojas colombo job");
// 	});
// }


var taskAll = cron.schedule(Jobs.all_schedule, function(err){
  	var time_start = new Date();	
	var dateUtile = new DateUtile();
  	start(function(){
   		dateUtile.getJobTime(time_start,function(){
  		});
  });
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing All job ...");	

	async.waterfall([
		// step_01 >> casasBahiaJob
		function(callback){
			casasBahiaJob.start(function(){
				console.log('casasBahiaJob finished >> ');
				callback(null);	
			});
		},
		// step_02 >> extraJob 
		function(callback){
			extraJob.start(function(){
				console.log('extraJob finished >> ');
				callback(null);	
			});
		},
		// step_03 >> girafaJob
		function(callback){
			girafaJob.start(function(){
				console.log('girafaJob finished >> ');
				callback(null);	
			});
		},
		// step_04 >> colomboJob
		function(callback){
			colomboJob.start(function(){
				console.log('colomboJob finished >> ');
				callback(null);	
			});
		},
		// step_05 >> pontoFrioJob
		function(callback){
			pontoFrioJob.start(function(){
				console.log('pontoFrioJob finished >> ');
				callback(null);	
			});
		},
		// step_06 >> ricardoJob
		function(callback){
			ricardoJob.start(function(){
				console.log('ricardoJob finished >> ');
				callback(null);	
			});
		},
		// step_07 >> ricardoJob
		function(callback){
			walmartJob.start(function(){
				console.log('walmartJob finished >> ');
				callback(null);	
			});
		},
		],function (err, result) {
			if(err){
				console.log("err >>",err);
				return next(err);
			}else{
				console.log("result >>",err);
				return next();
			}
	});
}

var starJob = function(next){
	return (taskAll.start());
};


exports.start = start;
exports.starJob = starJob;