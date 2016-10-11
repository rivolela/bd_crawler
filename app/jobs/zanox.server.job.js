var config = require('../../config/config.js');
var mongoose = require('mongoose');
var offerController = require('../controllers/offer.server.controller.js');
var zanoxController = require('../controllers/zanox.server.controller.js');
var request = require('request');
var flatten = require('flat');
var flatten2 = require('flat');
var urlTeste = "http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1141205/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]";
var cheerio = require('cheerio');
var async = require('async');
var cron = require('node-cron');

var taskZanox = cron.schedule(config.zanox_schedule, function(err){
  console.log('starting zanox job ...');
  var url = null;
  start(url,function(){
  	console.log(" Zanox job finished !");
  });
},false);



// var start = function(){
// 	//mongoose.createConnection(config.db, function(error) {
// 	//	if (error) {
// 	//		console.error('Error while connecting:\n%\n', error);
// 	//	}
// 	//	else{
// 	//		console.log('db connected');
// 			startZanox(function(){
// 				//mongoose.createConnection.close();
// 			});
//  	//	}
//  	//});
// };



function start(urlSearchOffers,next){

	var productsArray = [];
	var currentPage = 0;
	var currentItem = 0;
	var paginationArray = [];
	var productsArray = [];

	offerController.deleteCollectionOffersBD(function(){

		console.log("callback deleteCollectionOffersBD >>");

		setUrlOffers(urlSearchOffers,function(url){

			console.log("callback setUrlOffers >> ",url);

			zanoxController.getOffersContext(url,50,function(totalPaginacao,totalItems,itemsByPage){
				
				console.log("callback getOffersContext >> ");
				//var paginationArray = [];
				
				zanoxController.getPagination(currentPage,totalPaginacao,paginationArray,function(paginationArray){
					
					console.log("callback Zanox Pagination >>");

					zanoxController.getItemsByPagination(currentPage,paginationArray,function(paginationArray){

		    			console.log("callback get items by page >>");
		    			
		    			zanoxController.getProductsByPagination(currentPage,paginationArray,productsArray,function(productsArray){

		    				console.log("callback get products by pagination >>");

		    				offerController.saveOffersPickoout(currentItem,productsArray,function(productsArray){

		    					console.log("callback saveOffersPickoout");

		    					console.log("total offfers saved >> ",productsArray.length);

		    					return next(productsArray);

		    				});
			    		});
		    		});
				});
			});
		});

	});

	//return next(productsArray);
}


var setUrlOffers = function(urlSearchOffers,next){

	try{
		//if urlSearchOffers is null or empty, set url default
		if(Boolean(urlSearchOffers) === false){
			var host = 'api.zanox.com/json/2011-03-01/';
			var uri = 'products';
			var connectid = 'connectid=' + config.connectid;
			var programs = 'programs=' + config.programs;
			var query = 'q=' + config.query;
			//var category = '';
			var items = 'items=50';
			var url = 'https://' + host + uri + '?' + connectid + '&' + programs + '&' + query + '&' + items ;
			return next(url);
		}else{
			return next(urlSearchOffers);
		}
	}catch(error){
		console.log('An error has occurred >> zanox.server.job >>  setUrlOffers : '+ error.message);
    	throw error ;
	}
};


var starJob = function(next){
	return (taskZanox.start());
}

 
exports.start = start;
exports.setUrlOffers = setUrlOffers;
exports.starJob = starJob;
// start();

