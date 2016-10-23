var config = require('../../config/config.js'),
 	lcController = require('../controllers/lojas_colombo.server.controller.js'),
 	offerController = require('../controllers/offer.server.controller.js'),
 	cron = require('node-cron');


// if(process.env.NODE_ENV == 'test_job'){
// 	start(function(){
// 		console.log("end test lojas colombo job");
// 	});
// }


var taskColombo = cron.schedule(config.lojas_colombo_schedule, function(err){
  console.log('starting Lojas Colombo BR job ...');
  start(function(){
  	console.log("Lojas Colombo BR job finished !");
  });
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing Lojas Colombo BR job ...");
	query = {advertiser:'Lojas Colombo BR'};

	offerController.getOffersBD(query,function(arrayProducts){

		console.log("callback get offers Zanox from BD: >>",arrayProducts.length);
		console.log("\n");		

		lcController.setDataProducts(currentItem,arrayProducts,function(arrayProducts){
			  
			console.log("callback setDataProducts > ",arrayProducts.length);
				
			lcController.crawlerByProduct(currentItem,arrayProducts,function(contReview){

				console.log("callback crawlerByProduct >> ",contReview);
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




