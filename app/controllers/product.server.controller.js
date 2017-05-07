var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var config = require('../../config/config.js');
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var ZanoxMerchant = require('../../config/merchants/zanox.merchant.js');
var Review = mongoose.model( 'Review', ReviewSchema);
var reviewController = require('./review.server.controller.js');
var contReview = 0;
var callPhantom = new phantomUtile();
var async = require('async');
var request = require('request');


var updateProduct = function(offer,countSad,countHappy,totalReviews,next){

	try{
		var url = config.bdProductSrv + "/api/products/ean";

	  	request.put({
	    	headers: {'User-Agent': 'request','Content-Type' : 'application/json;charset=UTF-8'},
	    	url: url,
	      	form:{
	        	ean: offer.ean,
	        	countSad: countSad,
	        	countHappy: countHappy,
	        	totalReviews: totalReviews,
	      	}
	  	},function(error, response, body){
	    	return next(error, response, body);
  		});

	}catch(error){
		console.log('An error has occurred >> product.server.controller >>  updateProduct : '+ error.message);
    	throw error ;
	}	
};


var createProduct = function(offer,next){

	var url = config.bdProductSrv + 'products?connectid=A3697E2455EA755B758F';

	if(offer.image_medium !== undefined){
		image = offer.image_medium;
	}else{
		image = offer.image_large;
	}

	request.post({
		headers: {'User-Agent': 'request','Content-Type' : 'application/json;charset=UTF-8'},
		url: url,
		form:{
			name: offer.name,
			ean: offer.ean,
			manufacturer: offer.manufacturer,
			departamentBD: offer.departamentBD,
			countSad: offer.countSad,
			countHappy: offer.countHappy,
			totalReviews: offer.totalReviews,
			nameURL: offer.name,
			image: image
		}
	}, function(error, response, body){
	  	if(error) {
			console.log("error",error);
			console.log("response",response);
		}else{
			var data = JSON.parse(body);
			return next(error, response, data);
		}
	});
};



var updateProductReviews = function(offer,next){

   try{
     async.waterfall([
      // step_01 >> get product
      function(callback){
        var urlService = config.bdProductSrv + "products/ean/" + offer.ean + "?connectid=" + config.connectid;
        console.log("urlService >>",urlService);
        var call = new requestUtile();
        call.getJson(urlService,config.timeRequest,function(error,response,body){
            console.log("callback get json product >> ");
            console.log("body >>",body);
            if(body.total === undefined){
				callback('error step_01 for save product >>');
            }else{
            	 callback(null,body);
            }
           
        });
      },
      // step_02 >> save new product if necessary
      function(body,callback){
        var idProduct;
        console.log("body.total",body.total);
        if(body.total === 1){
          idProduct = body.docs[0]._id;
          console.log("idProduct already exists >> ",idProduct);
          callback(null,offer);
        }else{
          	createProduct(offer,function(error, response, data){
            	idProduct = data._id;
            	console.log("product created >> ",idProduct);
            	callback(null,'arg');
          	});
        }
      },
      // step_03 >> get summary reviews by ean
      function(arg,callback){
        if(offer.ean !== undefined){
          reviewController.getReviewsSummary(offer,function(countSad,countHappy,totalReviews){
          	console.log("Update product >> get summary >> ",offer.ean);
            callback(null,offer,countSad,countHappy,totalReviews);
          }); 
        }
      },
      // step_04 >> update product with reviews info
      function(offer,countSad,countHappy,totalReviews,callback){ 
        if(totalReviews > 0){
        	updateProduct(offer,countSad,countHappy,totalReviews,function(error, response, body){
            	console.log("Product updated");
              console.log("\n");
            	callback(null,'arg');
          	});
        }else{
        	callback(null,'arg');
        }        
      },
      ], function (err, result) {
        if(err){
          console.log("err >>",err);
          return next(err);
        }else{
          return next();
        }
    });

   }catch(e){
      console.log('An error has occurred >> product.server.controller >> updateProduct '+ e.message);
   }
};

exports.updateProductReviews = updateProductReviews;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
