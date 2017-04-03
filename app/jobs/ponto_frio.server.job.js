var config = require('../../config/config.js'),
	Jobs = require('../../config/jobs/jobs.config.js'),
 	pfController = require('../controllers/ponto_frio.server.controller.js'),
 	offerController = require('../controllers/offer.crawler.server.controller.js'),
 	DateUtile = require('../utile/date.server.utile.js'),
 	cron = require('node-cron');
 	async = require('async');


// if(process.env.NODE_ENV == 'test_job'){
// 	start(function(){
// 		console.log("end test lojas colombo job");
// 	});
// }


var taskPontoFrio = cron.schedule(Jobs.ponto_frio_schedule, function(err){
  	var time_start = new Date();	
	var dateUtile = new DateUtile();
  	start(function(){
   		dateUtile.getJobTime(time_start,function(){
  			console.log("Ponto Frio BR job finished !");
  		});
  });
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing Ponto Frio BR job ...");	

	async.waterfall([
		// step_01 >> get offers
		function(callback){
			query = {advertiser:'Pontofrio BR'};
			offerController.getOffersBD(query,function(arrayOffers){
				console.log("callback get offers Zanox from BD: >>",arrayOffers.length);	
				callback(null,arrayOffers);
			});		
		},
		// step_02 >> crawler page
		function(arrayOffers,callback){
			var currentItem = 0;
			pfController.crawlerByProduct(currentItem,arrayOffers,function(contReview){
				console.log("callback crawlerByProduct >> ");
				console.log("total reviews crawled >> ",contReview);
				callback(null,'arg');
			});
		},
		],function (err, result) {
			if(err){
				console.log("err >>",err);
				return next(err);
			}else{
				return next();
			}
	});
}

var starJob = function(next){
	return (taskPontoFrio.start());
};


exports.start = start;
exports.starJob = starJob;
