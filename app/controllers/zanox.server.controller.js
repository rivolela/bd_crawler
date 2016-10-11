var flatten = require('flat');
var requestsUtile = require('../utile/requests.server.utile.js');
var urlZanox;

//var call = new requestsUtile();
var Offer = require('../controllers/offer.server.controller.js');
// var host = 'api.zanox.com/json/2011-03-01/';
// var uri = 'products';
// var connectid = 'connectid=43EEF0445509C7205827';
// var programs = 'programs=12011';
// var query = 'q=geladeiras';
// var category = '';
// var items = 'items=50';
// var url = 'https://' + host + uri + '?' + connectid + '&' + programs + '&' + query + '&' + category + '&' + items ;



var getOffersContext = function(url,itemsByPage,next){

	try{

		var call = new requestsUtile();

		urlZanox = url;

		call.getJson(url,function(data){
			var totalItems = Number(data.total);
			var totalItemsByPage = Number(data.items);

			var totalPaginacao = Math.trunc(totalItems / totalItemsByPage);
			
			console.log("resume to search:");
			console.log("total paginação:", totalPaginacao);
			console.log("total items:", totalItems);
			console.log("items by Page:", totalItemsByPage);
			console.log("url:", url);			
			console.log('\n');

			return next(totalPaginacao,totalItems,totalItemsByPage);
		});
	}catch(error){
		console.log(error);
	}
	
};


var getPagination = function(currentPage,totalPaginacao,paginationArray,next){
	
	var call = new requestsUtile();

	if(currentPage < totalPaginacao){
		var pagination = new Object();// jshint ignore:line
		pagination.url = urlZanox + "&page=" + currentPage;
  		paginationArray.push(pagination);
		getPagination(currentPage+1,totalPaginacao,paginationArray,next);
	}else if( totalPaginacao < 0){
		totalPaginacao = 0;
		var pagination = new Object();// jshint ignore:line
		pagination.url = urlZanox + "&page=" + currentPage;
  		paginationArray.push(pagination);
		getPagination(currentPage+1,totalPaginacao,paginationArray,next);
		
	}else{
		return next(paginationArray);
	}
};


var getItemsByPagination = function(currentPage,paginationArray,next){

	try{
		var call = new requestsUtile();

		if(currentPage < paginationArray.length){

			console.log("getItemsByPagination >> ",paginationArray[currentPage].url);

			call.getJson(paginationArray[currentPage].url,function(json,response,error) {
	    		if(error) {
	        		console.log('error: '+ error.message);
	      		}
	      		else {
	      			flatten(json),{ 
		   				maxDepth: 10 
		   			};// jshint ignore:line
		   			paginationArray[currentPage].items = json.items;

		   			getItemsByPagination(currentPage+1,paginationArray,next);
				}
	    	});
		}else{
			return next(paginationArray);
		}
	}catch(error){
		console.log(error);
	}
};


var getProductsByPagination = function(currentPage,paginationArray,productsArray,next){

	try{
		if(currentPage < paginationArray.length){

			var call = new requestsUtile();

			call.getJson(paginationArray[currentPage].url,function(json,response,error) {

				console.log("getProductsByPagination >> ",paginationArray[currentPage].url);

	    		if(error) {
	        		console.log('error: '+ error);
	      		} 
	      		else {
	      			flatten(json),{ 
		   				maxDepth: 10 
		   			};// jshint ignore:line

		   			var currentItem = 0;

		   			getDetailsProductsArray(currentItem,json,productsArray,function(productsArray){
						getProductsByPagination(currentPage+1,paginationArray,productsArray,next);
					});

				}
		  	});
		}	
		else{
			return next(productsArray);
		}
	}catch(error){
		console.log(error);
	}
	
};


var getDetailsProductsArray = function(currentItem,data,productsArray,next){
	
	try{
		if(currentItem < data.items){
			var offer = new Object({
				name : data.productItems.productItem[currentItem].name,
				ean : data.productItems.productItem[currentItem].ean,
				category :  data.productItems.productItem[currentItem].merchantCategory,
				merchantProductId : data.productItems.productItem[currentItem].merchantProductId,
				url : data.productItems.productItem[currentItem].trackingLinks.trackingLink[0].ppc,
				manufacturer: data.productItems.productItem[currentItem].manufacturer,
				image: data.productItems.productItem[currentItem].image.medium,
				price: data.productItems.productItem[currentItem].price,
				advertiser: data.productItems.productItem[currentItem].program.$,
			});

			productsArray.push(offer);

			getDetailsProductsArray(currentItem+1,data,productsArray,next);

		}else{
		  return next(productsArray);
		}
	}catch(error){
		console.log(error);
	}
	
};



exports.getProductsByPagination = getProductsByPagination;
exports.getItemsByPagination = getItemsByPagination;
exports.getDetailsProductsArray = getDetailsProductsArray;
exports.getPagination = getPagination;
exports.getOffersContext = getOffersContext;








