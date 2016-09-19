var config = require('../../config/config.js');
var mongoose = require('mongoose');
var offerController = require('../controllers/offer.server.controller.js');
var zanoxController = require('../controllers/zanox.server.controller.js');
var request = require('request');
var flatten = require('flat');
var flatten2 = require('flat');
var urlTeste = "http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1141205/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]";
var cheerio = require('cheerio');


var host = 'api.zanox.com/json/2011-03-01/';
var uri = 'products';
var connectid = 'connectid=43EEF0445509C7205827';
var programs = 'programs=12011';
var query = 'q=geladeira%20brastemp';
var category = 'merchantcategory=Eletrodomésticos / Fogões / Fogão 4 bocas';
var items = 'items=50';
var url = 'https://' + host + uri + '?' + connectid + '&' + programs + '&' + query + '&' + category + '&' + items ;


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



function start(next){

	offerController.deleteCollectionOffersBD(function(){

		console.log("callback deleteCollectionOffersBD");

		zanoxController.getOffersContext(url,50,function(totalPaginacao,totalItems,itemsByPage){
			
			console.log("callback getOffersContext : get informations page");
			var paginationArray = [];
			var productsArray = [];
			var currentPage = 0;
	    	var currentItem = 0;
			
			zanoxController.getPagination(currentPage,totalPaginacao,paginationArray,function(paginationArray){
				
				console.log("callback Zanox Pagination");

				zanoxController.getItemsByPagination(currentPage,paginationArray,function(paginationArray){

	    			console.log("callback get items by page");
	    			
	    			zanoxController.getProductsByPagination(currentPage,paginationArray,productsArray,function(productsArray){

	    				console.log("callback get products by pagination");

	    				offerController.saveOffersPickoout(currentItem,productsArray,function(productsArray){

	    					console.log("callback saveOffersPickoout");

	    					console.log("total offfers saved >> ",productsArray.length);

	    					return next();

	    				});
		    		});
	    		});
			});
		});
	});
	
};

exports.start = start;
// start();

