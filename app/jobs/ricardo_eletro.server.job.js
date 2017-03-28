var config = require('../../config/config.js'),
	Jobs = require('../../config/jobs/jobs.config.js'),
 	ricardoController = require('../controllers/ricardo_eletro.server.controller.js'),
 	offerController = require('../controllers/offer.crawler.server.controller.js'),
 	DateUtile = require('../utile/date.server.utile.js'),
 	cron = require('node-cron');


var taskRicardo = cron.schedule(Jobs.ricardo_eletro_schedule, function(err){
	var time_start = new Date();	
	var dateUtile = new DateUtile();
  	start(function(){
  		dateUtile.getJobTime(time_start,function(){
  			console.log("Ricardo Eletro BR job finished !");
  		});
    });
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing ricardo eletro job ...");
	query = {advertiser:'Ricardo Eletro BR'};

	offerController.getOffersBD(query,function(arrayProducts){

		console.log("callback get offers Zanox from BD: >>",arrayProducts.length);	

		ricardoController.setProductIdArrayProducts(currentItem,arrayProducts,function(arrayProducts){
			  
			console.log("callback setProductIdArrayProducts > ");

			ricardoController.setTotalPaginationArrayProducts(currentItem,arrayProducts,function(arrayProductsReview){

				console.log("callback setTotalPaginationArrayProducts >>");

				console.log("total arrayProductsReview >> ",arrayProductsReview.length);

				ricardoController.crawlerByProduct(currentItem,arrayProductsReview,function(contReview){

					console.log("callback crawlerByProduct >> ");

					console.log("total reviews crawled >> ",contReview);
					
					return next();
				});

			});
		});
	});
}


var starJob = function(next){
	return (taskRicardo.start());
};


exports.start = start;
exports.starJob = starJob;


