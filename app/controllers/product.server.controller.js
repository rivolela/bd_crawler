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


var updateProduct = function(offer,countSad,countHappy,totalReviews,next){

  console.log("offer",offer);

  console.log("offer image",offer.image_medium);

	try{

    var image_product;

    if(offer.image_medium){
      image_product = offer.image_medium; 
    }else{
      image_product = offer.image_large;
    };

		var url = config.bdProductSrv + "products/ean?connectid=A3697E2455EA755B758F";

    console.log("image_product",image_product);
    console.log("url",url);

  	request.put({
       headers: {'User-Agent': 'request','Content-Type' : 'application/json;charset=UTF-8'},
       url: url,
       form: {
        ean: offer.ean,
        manufacturer: offer.manufacturer,
        departamentBD: offer.departamentBD,
        countSad: countSad,
        countHappy: countHappy,
        totalReviews: totalReviews,
        image: image_product
       }
  	},function(error, response, body){
      var data = JSON.parse(body);
     	return next(error, response, data);
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
    
      // step_01 >> get summary reviews by ean
      function(callback){
        if(offer.ean !== undefined){
          console.log("Step01 | get reviews from ean >> ",offer.ean);
          reviewController.getReviewsSummary(offer,function(countSad,countHappy,totalReviews){
            callback(null,countSad,countHappy,totalReviews);
          }); 
        }else{
          callback("offer with ean undefined");
        }
      },
      // step_02 >> get product with totalReviews > 0
      function(countSad,countHappy,totalReviews,callback){

        console.log("countSad >>",countSad);
        console.log("countHappy >>",countHappy);
        console.log("totalReviews >>",totalReviews);
        
        if(totalReviews > 0){

          console.log("Step02 | get product from ean >> ",offer.ean);

          var urlService = config.bdProductSrv + "products/ean/" + offer.ean + "?connectid=" + config.connectid;
          console.log("urlService >>",urlService);
          var call = new requestUtile();

          call.getJson(urlService,config.timeRequest,function(error,response,body){

              var idProduct;

              if(body.total === 0){
                createProduct(offer,function(error, response, data){
                  idProduct = data._id;
                  console.log("Step02 | Create new product >> " + idProduct + " >> ean >>" + offer.ean);
                  callback(null,countSad,countHappy,totalReviews);
                });
              }else{
                idProduct = body.docs[0]._id;
                console.log("Step02 | Product already exists >> " + idProduct + " >> ean >>" + offer.ean);
                callback(null,countSad,countHappy,totalReviews);
              }
          });

        }else{
          callback('offer ' + offer.ean + " with totalReviews < 0");
        }
     
      },
      // step_03 >> update product with reviews info
      function(countSad,countHappy,totalReviews,callback){ 

        console.log("Step03 | update product >> " + "ean >>" + offer.ean);

       	updateProduct(offer,countSad,countHappy,totalReviews,function(error, response, body){
            console.log("\n");
          	callback(null,'Product updated');
        });
 
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
