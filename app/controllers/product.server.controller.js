var cheerio = require('cheerio');
var mongoose = require('mongoose');
var ProductSchema = require('../models/product.server.model');
var Product = mongoose.model( 'Product', ProductSchema);
var Offer_CrawlerSchema = require('../models/offer.crawler.server.model');
var Offer = mongoose.model( 'Offer_Crawler', Offer_CrawlerSchema);
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


var updateProduct = function(offer,countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating,next){

	try{

    var image_product;

    if(offer.image_medium !== undefined){
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
        image: image_product,
        ratingValue: ratingValue,
        worstRating: worstRating,
        bestRating: bestRating
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


var createProduct = function(offer,countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating,next){

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
			image: image,
      ratingValue: ratingValue,
      worstRating: worstRating,
      bestRating: bestRating
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

  var myArr = JSON.stringify(offer);
  var myObj = JSON.parse(myArr);

  console.log("offer updateProductReviews >>",myObj);

   try{
     async.waterfall([
    
      // step_01 >> get summary reviews by ean
      function(callback){
        if(offer.ean !== undefined){
          console.log("Step01 | get reviews from ean >> ",myObj.ean);
          reviewController.getReviewsSummary(myObj,function(countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating){
            callback(null,countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating);
          }); 
        }else{
          callback("offer with ean undefined");
        }
      },
      // step_02 >> get product with totalReviews > 0
      function(countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating,callback){

        if(totalReviews > 0){

          console.log("Step02 | get product from ean >> ",myObj.ean);

          var urlService = config.bdProductSrv + "products/ean/" + myObj.ean + "?connectid=" + config.connectid;
          console.log("urlService >>",urlService);
          var call = new requestUtile();

          call.getJson(urlService,config.timeRequest,function(error,response,body){

              var idProduct;

              if(body.total === 0){
                createProduct(myObj,countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating,function(error, response, data){
                  idProduct = data._id;
                  console.log("Step02 | Create new product >> " + idProduct + " >> ean >>" + myObj.ean);
                  callback(null,countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating);
                });
              }else{
                idProduct = body.docs[0]._id;
                console.log("Step02 | Product already exists >> " + idProduct + " >> ean >>" + myObj.ean);
                callback(null,countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating);
              }
          });

        }else{
          callback('offer ' + myObj.ean + " with totalReviews < 0");
        }
     
      },
      // step_03 >> update product with reviews info
      function(countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating,callback){ 

        console.log("Step03 | update product >> " + "ean >>" + myObj.ean);

       	updateProduct(myObj,countSad,countHappy,totalReviews,ratingValue,worstRating,bestRating,function(error, response, body){
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
