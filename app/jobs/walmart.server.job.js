var config = require('../../config/config.js'),
	mongoose = require('mongoose'),
	Jobs = require('../../config/jobs/jobs.config.js'),
	walmartController = require('../controllers/walmart.server.controller.js'),
	offerController = require('../controllers/offer.crawler.server.controller.js'),
	reviewController = require('../controllers/review.server.controller.js'),
	request = require('request'),
	urlTeste = "http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1141205/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	cheerio = require('cheerio'),
	DateUtile = require('../utile/date.server.utile.js'),
	cron = require('node-cron'),
	async = require('async');


var taskWalmart = cron.schedule(Jobs.walmart_schedule, function(err){
	
	var time_start = new Date();	
	var dateUtile = new DateUtile();

  	start(function(){
  		dateUtile.getJobTime(time_start,function(){
  			console.log("walmart job finished !");
  		});
    });
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing walmart job ...");

	async.waterfall([
		// step_01 >> get offers
		function(callback){
			query = {advertiser:'Walmart BR'};
			offerController.getOffersBD(query,function(arrayOffers){
				console.log("callback get offers Zanox from BD: >>",arrayOffers.length);	
				callback(null,arrayOffers);
			});		
		},
		// step_02 >> crawler page
		function(arrayOffers,callback){
			var currentItem = 0;
			walmartController.crawlerByProduct(currentItem,arrayOffers,function(contReview){
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
	return (taskWalmart.start());
};


exports.start = start;
exports.starJob = starJob;





   

