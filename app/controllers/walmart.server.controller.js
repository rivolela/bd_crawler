var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var timeRequest = 4000;
var config = require('../../config/config.js');
var reviewController = require('../controllers/review.server.controller.js');
var Offer = require('../controllers/offer.server.controller.js');
var call = new requestUtile();


var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);


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
    console.log('An error has occurred: '+ e.message);
  }
};
 

var setDataProducts = function(currentItem,arrayProducts,next){

  if(currentItem < arrayProducts.length){

    var urlToCrawler = config.walmart_url + arrayProducts[currentItem].urlOffer;
    console.log("item >> ",currentItem);
    console.log("urlToCrawler >> ",urlToCrawler);
    //console.log('\n');
  
    call.getHtml(urlToCrawler,timeRequest,function(error,response,body){
      if(error){
        console.log("error:",error);
      }else{
        getProductContext(body,function(productid,totalReviewsPage,totalPaginacaoReviews){

          arrayProducts[currentItem].dataProductId = productid;
          arrayProducts[currentItem].totalReviewsPage = totalReviewsPage;
          arrayProducts[currentItem].totalPaginacaoReviews = totalPaginacaoReviews;
          console.log("Product ean >> ",arrayProducts[currentItem].ean);
          console.log("advertiser >> ", arrayProducts[currentItem].advertiser);
          console.log("adding attribute dataProductId >> ",arrayProducts[currentItem].dataProductId);
          console.log("adding attribute totalReviewsPage >> ",arrayProducts[currentItem].totalReviewsPage);
          console.log("adding attribute totalPaginacaoReviews >> ", arrayProducts[currentItem].totalPaginacaoReviews);
          console.log('\n');

          setDataProducts(currentItem+1,arrayProducts,next);

        });
      }
    });

  }else{
    return next(arrayProducts);
  }
};


var crawlerByProduct = function(currentItem,arrayProducts,next){

  // for each product
  if(currentItem < arrayProducts.length){

    if((arrayProducts[currentItem].totalReviewsPage > 0) && (arrayProducts[currentItem].ean != 'undefined')){
      
      var currentPaginationReview = 0;
      
      crawlerByReviewPagination(currentItem,currentPaginationReview,arrayProducts,function(arrayProducts){
        console.log('callback saveReviewsByPagination');
        crawlerByProduct(currentItem + 1,arrayProducts,next);
      });
    }else{
      console.log("offer without ean or with total reviews < 0");
      crawlerByProduct(currentItem + 1,arrayProducts,next);
    }

  }else{
    return next(arrayProducts);
  }
};


var crawlerByReviewPagination = function(currentItem,currentPaginationReview,arrayProducts,next){
  
  var productReview = arrayProducts[currentItem];

  try{
      // for each review pagination
    if(currentPaginationReview < arrayProducts[currentItem].totalPaginacaoReviews){

      var dataProductId = arrayProducts[currentItem].dataProductId;
      var urlToCrawler = 'https://www.walmart.com.br/xhr/reviews/'+ dataProductId + '/?pageNumber=' + currentPaginationReview;
      console.log("urlToCrawler >> ",urlToCrawler);
      var call = new requestUtile();
 
      call.getHtml(urlToCrawler,timeRequest,function(error,response,body){
        console.log("callback getHtml >> body >> ",body);
        if(error){
          console.log("error:",error);
        }else{
          getReviewsFromHtml(body,productReview,function(reviews){
            
            var currentItemArray = 0;
            
            reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
              crawlerByReviewPagination(currentItem,currentPaginationReview+1,arrayProducts,next);
            });

          });
        }
      });

    }else{
      return next(arrayProducts);
    }

  }catch(e){
    console.log('An error has occurred >> getReviewsByPagination '+ e.message);
  }
};


var getReviewsFromHtml = function(body,product,next){

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

        review.category = product.category,
        review.url = product.url,
        review.advertiser = product.advertiser,
        review.manufacturer = product.manufacturer,
        review.ean = product.ean,

        review.title = review.title.replace(/['"]+/g,'');// jshint ignore:line
        review.description = review.description.replace(/['"]+/g, '');
        review.location = review.location.replace(new RegExp('\r?\n','g'), ' ');

        console.log("Review from product ean >> ",product.ean);
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





