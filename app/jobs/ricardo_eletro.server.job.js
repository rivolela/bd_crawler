var config = require('../../config/config.js'),
 	ricardoController = require('../controllers/ricardo_eletro.server.controller.js'),
 	offerController = require('../controllers/offer.server.controller.js'),
 	cron = require('node-cron');


var taskRicardo = cron.schedule(config.ricardo_eletro_schedule, function(err){
  console.log('starting Ricardo Eletro BR job ...');
  start(function(){
  	console.log("Ricardo Eletro BR job finished !");
  });
},false);


function start(next){

	var currentItem = 0;
	console.log("initializing ricardo eletro job ...");
	query = {advertiser:'Ricardo Eletro BR'};

	offerController.getOffersBD(query,function(arrayProducts){

		console.log("callback get offers Zanox from BD: >>",arrayProducts.length);	

		ricardoController.setDataProducts(currentItem,arrayProducts,function(arrayProducts){
			  
			console.log("callback setDataProducts > ",arrayProducts.length);
				
			ricardoController.crawlerByProduct(currentItem,arrayProducts,function(arrayProducts){

				console.log("callback crawlerByProduct >> ",arrayProducts.length);
				return next(arrayProducts);
			});
		});
	});
}

var starJob = function(next){
	return (taskRicardo.start());
};


//start();
exports.start = start;
exports.starJob = starJob;


