var config = require('../../config/config.js'),
	Jobs = require('../../config/jobs/jobs.config.js'),
 	lcController = require('../controllers/lojas_colombo.server.controller.js'),
 	offerController = require('../controllers/offer.crawler.server.controller.js'),
 	DateUtile = require('../utile/date.server.utile.js'),
 	cron = require('node-cron');


// if(process.env.NODE_ENV == 'test_job'){
// 	start(function(){
// 		console.log("end test lojas colombo job");
// 	});
// }


var taskColombo = cron.schedule(Jobs.lojas_colombo_schedule, function(err){

  	var time_start = new Date();	
	var dateUtile = new DateUtile();
  	start(function(){
   		dateUtile.getJobTime(time_start,function(){
  			console.log("Lojas Colombo BR job finished !");
  		});
  	});
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing Lojas Colombo BR job ...");
	query = {advertiser:'Lojas Colombo BR'};

	offerController.getOffersBD(query,function(arrayProducts){

		console.log("callback get offers Zanox from BD: >>",arrayProducts.length);
		console.log("\n");		

		lcController.setDataProducts(currentItem,arrayProducts,function(arrayProductsReview){
			  
			console.log("callback setDataProducts >>");

			console.log("total arrayProductsReview >> ",arrayProductsReview.length);
				
			lcController.crawlerByProduct(currentItem,arrayProductsReview,function(contReview){

				console.log("callback crawlerByProduct >> ");

				console.log("total reviews crawled >> ",contReview);
				
				return next();
			});
		});
	});
}

var starJob = function(next){
	return (taskColombo.start());
};


exports.start = start;
exports.starJob = starJob;




