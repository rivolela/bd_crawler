var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
// var timeRequest = 4000;
var config = require('../../config/config.js');
var ZanoxMerchant = require('../../config/merchants/zanox.merchant.js');
var reviewController = require('../controllers/review.server.controller.js');
var Offer = require('../controllers/offer.crawler.server.controller.js');
var call = new requestUtile();
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var contReview = 0;
var Offer_CrawlerSchema = require('../models/offer.crawler.server.model');
var Offer = mongoose.model( 'Offer_Crawler', Offer_CrawlerSchema);
var async = require('async');
var productController = require('./product.server.controller.js');


var getProductContext = function(body,next){
  
  try{

    $ = cheerio.load(body);
    var productid = $('#rating').attr('data-productid');
    var totalReviewsPage = $('#rating').children('.star-rating-review-amount').children('meta[itemprop=ratingCount]').attr('content');
    // Math.ceil() rounds a number up to the nearest integer:
    var totalPaginacaoReviews = Math.ceil(totalReviewsPage / 4);

    // if(totalPaginacaoReviews == 0){
    //   totalPaginacaoReviews = 1;
    // }
    return next(productid,totalReviewsPage,totalPaginacaoReviews);
  }catch(e){
    console.log('An error has occurred >> getProductContext >> '+ e.message);
  }
};
 

var setDataProducts = function(offer,next){

    try{

      var urlToCrawler = ZanoxMerchant.walmart_url + offer.urlOffer;
      console.log("urlToCrawler >> ",urlToCrawler);
    
      call.getHtml(urlToCrawler,config.timeRequest,function(error,response,body){
        if(error){
          console.log("error setDataProducts:",error);
          return next(null);
        }else{
          getProductContext(body,function(productid,totalReviewsPage,totalPaginacaoReviews){

            if((totalReviewsPage > 0) && (offer.ean !== undefined)){

              console.log("Product ean >> ", offer.ean);
              console.log("advertiser >> ",  offer.advertiser);
              console.log("dataProductId >> ",productid);
              console.log("totalReviewsPage >> ",totalReviewsPage);
              console.log("totalPaginacaoReviews >> ", totalPaginacaoReviews);
              console.log('\n');

              return next(productid,totalReviewsPage,totalPaginacaoReviews);

            }else{
              console.log("offer without ean or with total reviews < 0");
              console.log('\n');
              return next(null);
            }
          });
        }
      });
    
    }catch(e){
      console.log('An error has occurred >> setDataProducts >> '+ e.message);
    }
};


var crawlerByProduct = function(currentItem,arrayOffers,next){

  // for each product
  if(currentItem < arrayOffers.length){

    async.waterfall([
      // step_01 >> setDataProducts
      function(callback){
        var offer = arrayOffers[currentItem];
        setDataProducts(offer,function(productid,totalReviewsPage,totalPaginacaoReviews){
           callback(null,offer,productid,totalReviewsPage,totalPaginacaoReviews); 
        });
      },
      // step_02 >> crawlerByReviewPagination
      function(offer,productid,totalReviewsPage,totalPaginacaoReviews,callback){
        // for each review pagination
        var currentPaginationReview = 0;
        crawlerByReviewPagination(offer,currentPaginationReview,productid,totalPaginacaoReviews,function(contReview){
          console.log('total of reviews saved at the moment >> ',contReview);
          callback(null,offer); 
        });
      },
      // step_03 >> update product
      function(offer,callback){
        productController.updateProductReviews(offer,function(){
          callback(null,'product updated'); 
        });
      },
      ], function (err, result) {
        if(err){
          console.log("err >>",err);
          crawlerByProduct(currentItem + 1,arrayOffers,next);    
        }else{
          crawlerByProduct(currentItem + 1,arrayOffers,next);
        }
    });

  }else{
    return next(contReview);
  }
};


var crawlerByReviewPagination = function(offer,currentPaginationReview,dataProductId,totalPaginacaoReviews,next){

  try{
      // for each review pagination
    if(currentPaginationReview < totalPaginacaoReviews){

      var urlToCrawler = 'https://www.walmart.com.br/xhr/reviews/'+ dataProductId + '/?pageNumber=' + currentPaginationReview;
      console.log("urlToCrawler >> ",urlToCrawler);
      var call = new requestUtile();
 
      call.getHtml(urlToCrawler,config.timeRequest,function(error,response,body){
        
        if(error){
          console.log("error crawlerByReviewPagination:",error);
          crawlerByReviewPagination(offer,currentPaginationReview + 1,dataProductId,totalPaginacaoReviews,next);
        }else{

          getReviewsFromHtml(body,offer,function(reviews){          
            var currentItemArray = 0;     
            reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
              contReview = contReview + arrayReviews.length;
              crawlerByReviewPagination(offer,currentPaginationReview + 1,dataProductId,totalPaginacaoReviews,next);
            });
          });
        }
      });

    }else{
      return next(contReview);
    }

  }catch(e){
    console.log('An error has occurred >> getReviewsByPagination '+ e.message);
  }
};


var getReviewsFromHtml = function(body,offer,next){

  try{

    var reviews = [];
    
    $ = cheerio.load(body);

    $('.customer-review').each(function(i, elem) {

        var review = new Review ({
          title: $(this).children('.customer-review-head').text(),
          description: $(this).children('.description-customer-review').text(),
          author: $(this).children('.customer-data').children('.customer-author').text(),
          location: $(this).children('.customer-data').children('.location').children('.city-client').text(),
          date: $(this).children('.customer-data').children('meta').attr('content'),
        });

        if($(this).children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-10')){
          review.rating = 1;
        }else if($(this).children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-20')){
          review.rating = 2;
        }else if($(this).children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-30')){
          review.rating  = 3;
        }else if($(this).children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-40')){
          review.rating = 4;
        }else if ($(this).children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-50')){
          review.rating = 5;
        } else {
          review.rating = 0;
        }

        review.category = offer.category,
        review.url = offer.url,
        review.advertiser = offer.advertiser,
        review.manufacturer = offer.manufacturer,
        review.ean = offer.ean,

        review.title = review.title.replace(/['"]+/g,'');// jshint ignore:line
        review.description = review.description.replace(/['"]+/g, '');
        review.location = review.location.replace(new RegExp('\r?\n','g'), ' ');

        console.log("Review from offer ean >> ",offer.ean);
        console.log("review >> ",i," >> ");
        console.log(review);
        console.log('\n');
        reviews.push(review);
    });

    return next(reviews);

  }catch(error){
    console.log('An error has occurred >> walmart.server.controller >>  getReviewsFromHtml : '+ error.message);
    throw error ;
  }
};
  

var setTimeRequest = function(newTimeRequest,next){
  timeRequest = newTimeRequest;
  return next();
};


var saveReviewsToPickoout = function(currentItemProduct,arrayProductsWalmart,next){
 
  console.log(arrayProductsWalmart.length);

  // try{

    if(currentItemProduct < arrayProductsWalmart.length){

      if(arrayProductsWalmart[currentItemProduct].totalReviewsPage > 0){
          var currentItem = 0;
          //console.log(arrayProductsWalmart[currentItemProduct].reviews);
          reviewController.saveArrayReviews(currentItem,arrayProductsWalmart[currentItemProduct].reviews,function(arrayReviews){
            saveReviewsToPickoout(currentItemProduct + 1,arrayProductsWalmart,next);
          });
      }else{
          saveReviewsToPickoout(currentItemProduct+1,arrayProductsWalmart,next);
      }

    }else{
      return next(arrayProductsWalmart);
    }

  // }catch(e){
  //   console.log('An error has occurred: '+ e.message);
  //   throw new Error("Error saveReviewsToPickout >>", e);
  // }
  
};


exports.setDataProducts = setDataProducts;
exports.crawlerByProduct = crawlerByProduct;
exports.getProductContext = getProductContext;
exports.crawlerByReviewPagination = crawlerByReviewPagination;
exports.setTimeRequest = setTimeRequest;
exports.saveReviewsToPickoout = saveReviewsToPickoout;
exports.getReviewsFromHtml = getReviewsFromHtml;





