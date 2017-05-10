var cheerio = require('cheerio');
var mongoose = require('mongoose');
var ProductSchema = require('../models/product.server.model');
var Product = mongoose.model( 'Product', ProductSchema);
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var config = require('../../config/config.js');
var mongoose = require('mongoose');
var ZanoxMerchant = require('../../config/merchants/zanox.merchant.js');
var reviewController = require('./review.server.controller.js');
var contReview = 0;
var callPhantom = new phantomUtile();
var async = require('async');
var request = require('request');


var updateProduct = function(offer,updateFields,next){

  // console.log("updateFields",updateFields);
	try{
		var url = config.bdProductSrv + "/api/products/ean?connectid=A3697E2455EA755B758F";

	  	request.put({
	    	headers: {'User-Agent': 'request','Content-Type' : 'application/json;charset=UTF-8'},
	    	url: url,
	      	form:
            updateFields,
          //{
          //   name: offer.name,
	        	// ean: offer.ean,
          //   manufacturer: offer.manufacturer,
	         //  departamentBD: offer.departamentBD,
          //   countSad: offer.countSad,
          //   countHappy: offer.countHappy,
          //   totalReviews: offer.totalReviews,
	        	// totalReviews: totalReviews,
          //   nameURL: offer.name,
          //   image: offer.image
	      	//}
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


var deleteProductByEAN = function(product,next){

  console.log("product",product);

 var url = config.bdProductSrv + 'products/ean/' + product.ean + '?connectid=A3697E2455EA755B758F';

  console.log(url);

  request.delete({
    headers: {'User-Agent': 'request','Content-Type' : 'application/json;charset=UTF-8'},
    url: url,
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
            if(body.total === undefined){
				      callback('Step01 | Error get product by EAN >>');
            }else{
              console.log('Step01 | callback get product by EAN >>');
            	callback(null,body);
            }
        });
      },
      // step_02 >> check if product exists
      function(body,callback){
        var idProduct;
        if(body.total > 0){
          idProduct = body.docs[0]._id;
          console.log("Step02 |idProduct already exists >> ",idProduct);
          callback(null,offer);
        }else{
          console.log("Step02 | create new product >> ");
        	createProduct(offer,function(error, response, data){
          	idProduct = data._id;
          	console.log("Step02 |idProduct already exists >> ",idProduct);
          	callback(null,offer);
        	});
        }
      },
      // step_03 >> get summary reviews by ean
      function(offer,callback){
        if(offer.ean !== undefined){
          reviewController.getReviewsSummary(offer,function(countSad,countHappy,totalReviews){
            console.log("Step03 | get summary  >> ",offer.ean);
            console.log("Step03 | get summary  >> countSad >> ",countSad);
            console.log("Step03 | get summary  >> countHappy >> ",countHappy);
            console.log("Step03 | get summary  >> totalReviews >> ",totalReviews);
            callback(null,offer,countSad,countHappy,totalReviews);
          }); 
        }
      },
      // step_04 >> update product with reviews info
      function(offer,countSad,countHappy,totalReviews,callback){ 
        if(totalReviews > 0){
          console.log("Step04 | update product >> ",offer.ean);

          var image;

          console.log("offer",offer);

          if(offer.image_medium !== undefined){
            image = offer.image_medium;
          }else{
            image = offer.image_large;
          };

          var updateFields = {
            countSad:countSad,
            countHappy:countHappy,
            totalReviews:totalReviews,
            image:image,
            manufacturer: offer.manufacturer,
          };

        	updateProduct(offer,updateFields,function(error, response, body){
            	// console.log("Product updated");
              console.log("\n");
            	callback(null,'Product updated');
          	});
        }else{
        	callback(null,'Product updated');
        }        
      },
      ], function (err, result) {
        if(err){
          console.log("err >>",err);
          return next(err);
        }else{
          return next(result);
        }
    });

   }catch(e){
      console.log('An error has occurred >> product.server.controller >> updateProduct '+ e.message);
   }
};

exports.updateProductReviews = updateProductReviews;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProductByEAN = deleteProductByEAN;
