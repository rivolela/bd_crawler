var config = require('../../config/config.js'),
 	pfController = require('../controllers/ponto_frio.server.controller.js'),
 	offerController = require('../controllers/offer.crawler.server.controller.js'),
 	DateUtile = require('../utile/date.server.utile.js'),
 	cron = require('node-cron');


// if(process.env.NODE_ENV == 'test_job'){
// 	start(function(){
// 		console.log("end test lojas colombo job");
// 	});
// }


var taskPontoFrio = cron.schedule(config.ponto_frio_schedule, function(err){
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
	query = {advertiser:'Pontofrio BR'};

	offerController.getOffersBD(query,function(arrayProducts){

		console.log("callback get offers Zanox from BD: >>",arrayProducts.length);
		console.log("\n");		

		pfController.setDataProducts(currentItem,arrayProducts,function(arrayProductsReview){
			  
			console.log("callback setDataProducts >>");

			console.log("total arrayProductsReview >> ",arrayProductsReview.length);
				
			pfController.crawlerByProduct(currentItem,arrayProducts,function(contReview){

				console.log("callback crawlerByProduct >> ");

				console.log("total reviews crawled >> ",contReview);

				return next();
			});
		});
	});
}

var starJob = function(next){
	return (taskPontoFrio.start());
};


exports.start = start;
exports.starJob = starJob;
