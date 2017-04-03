var config = require('../../config/config.js'),
	Jobs = require('../../config/jobs/jobs.config.js'),
 	girafaController = require('../controllers/girafa.server.controller.js'),
 	offerController = require('../controllers/offer.crawler.server.controller.js'),
 	DateUtile = require('../utile/date.server.utile.js'),
 	cron = require('node-cron'),
 	async = require('async');


var taskGirafa = cron.schedule(Jobs.girafa_schedule, function(err){
	var time_start = new Date();	
	var dateUtile = new DateUtile();
  	start(function(){
  		dateUtile.getJobTime(time_start,function(){
  			console.log("Girafa BR job finished !");
  		});
    });
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing girafa job ...");		

	async.waterfall([
		// step_01 >> get offers
		function(callback){
			query = {advertiser:'Girafa BR'};
			offerController.getOffersBD(query,function(arrayOffers){
				console.log("callback get offers Zanox from BD: >>",arrayOffers.length);	
				callback(null,arrayOffers);
			});		
		},
		// step_02 >> crawler page
		function(arrayOffers,callback){
			girafaController.crawlerPage(currentItem,arrayOffers,function(contReview){
				console.log("total reviews crawled >> ",contReview);
				callback(null,'arg');
			});
		}
		], function (err, result) {
			if(err){
				console.log("err >>",err);
				return next(err);
			}else{
				return next();
			}
	});
}


var starJob = function(next){
	return (taskGirafa.start());
};


exports.start = start;
exports.starJob = starJob;
