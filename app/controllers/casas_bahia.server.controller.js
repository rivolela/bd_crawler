var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var ZanoxMerchant = require('../../config/merchants/zanox.merchant.js');
var reviewController = require('./review.server.controller.js');
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var config = require('../../config/config.js');
var contReview = 0;
var call = new requestUtile();


var getProductContext = function(body,next){
  
  try{

    $ = cheerio.load(body);

    var totalReviewsPage = $('#pr-review-count').text();
    var totalPaginacaoReviews;

    if((totalReviewsPage === undefined) || (totalReviewsPage === '')) {
       totalPaginacaoReviews = 0;
    }else{
      var totalReviewsPageSplit = totalReviewsPage.match(/\d+/g);
      // Math.ceil() rounds a number up to the nearest integer:
       totalPaginacaoReviews = Number(Math.ceil(totalReviewsPageSplit[0] / 10));
    }

    return next(totalPaginacaoReviews);

  }catch(e){
    console.log('An error has occurred >> extra.controller >> getProductContext >> '+ e.message);
  }
};


var setDataProducts = function(offer,next){

    try{

        var nameOffer = offer.name;
        var idOffer = offer.merchantProductId;

        var urlToCrawler =  ZanoxMerchant.casas_bahia_url + nameOffer + '-' + idOffer + ".html";
        // remove double quotes
        var result_urlToCrawler = urlToCrawler.replace(/\"/g, "");
        var result_urlToCrawler_2 = result_urlToCrawler.replace(/\+/g, "");
                  
        console.log("offer >> ",offer.name);
        console.log("urlToCrawler >> ",result_urlToCrawler_2);

        call.getHtml(result_urlToCrawler_2,config.timeRequest,function(error,response,body){
          if(error){
              console.log("error setDataProducts:",error);
              return next(null);
          }else{
          
            getProductContext(body,function(totalPaginacaoReviews){

              if((totalPaginacaoReviews > 0) && (offer.ean !== undefined)){

                console.log("Product ean >> ",offer.ean);
                console.log("advertiser >> ", offer.advertiser);
                console.log("totalPaginacaoReviews >> ", totalPaginacaoReviews);
                console.log('\n');

                return next(totalPaginacaoReviews);

              }else{
                console.log("offer without ean or with total reviews < 0");
                console.log('\n');
                return next(null);
              }

            });
          }
        });
    }catch(e){
      console.log('An error has occurred >> extra.server.controller >> setDataProducts >>'+ e.message);
    }
};


var crawlerByProduct = function(currentItem,arrayOffers,next){

	try{

       // for each product
      if(currentItem < arrayOffers.length) {
        async.waterfall([
          // step_01 >> setDataProducts
          function(callback){
            var offer = arrayOffers[currentItem];
            setDataProducts(offer,function(totalPaginacaoReviews){
                callback(null,offer,totalPaginacaoReviews); 
            });
          },
          // step_02 >> crawlerByReviewPagination
          function(offer,productid,totalPaginacaoReviews,callback){
            // for each review pagination
            var currentPaginationReview = 1;
            crawlerByReviewPagination(offer,currentPaginationReview,totalPaginacaoReviews,function(contReview){
              console.log('total of reviews saved at the moment >> ',contReview);
              callback(null,'arg'); 
            });
          }
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
}catch(e){
	    console.log('An error has occurred >> extra.server.controller >> crawlerByProduct >>'+ e.message);
	}
};


var crawlerByReviewPagination = function(offer,currentPaginationReview,next){
  

  try{
      // for each review pagination
    if(currentPaginationReview <= 1){

	    var urlToCrawler = 	ZanoxMerchant.casas_bahia_url +
	    					          offer.name + '-' +
	    					          offer.merchantProductId + ".html";

      // remove double quotes
      var result_urlToCrawler = urlToCrawler.replace(/\"/g, "");
      var result_urlToCrawler_2 = result_urlToCrawler.replace(/\+/g, "");

      console.log("urlToCrawler",result_urlToCrawler_2);

      call.getHtml(result_urlToCrawler_2,config.timeRequest,function(error,response,body){

         if(error){
              console.log("error crawlerByReviewPagination:",error);
              crawlerByReviewPagination(offer,currentPaginationReview+1,next);
          }else{

            getReviewsFromHtml(body,offer,function(reviews){
        
              var currentItemArray = 0;
            
              reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
                contReview = contReview + arrayReviews.length;
                crawlerByReviewPagination(offer,currentPaginationReview+1,next);
                });
              });
          }
      });

    }else{
      return next(contReview);
    }

  }catch(e){
    console.log('An error has occurred >> extra.server.controller >> getReviewsByPagination '+ e.message);
  }
};


var getReviewsFromHtml = function(body,offer,next){

  try{

    var reviews = [];
    
    $ = cheerio.load(body);

    $('.pr-review-wrap').each(function(i, elem) {
        
        var resultTitle =  $(this).children('.pr-review-rating-wrapper').children('.pr-review-rating').children('.pr-review-rating-headline').text(); 
        var resultRating = $(this).children('.pr-review-rating-wrapper').children('.pr-review-rating').children('.pr-rating').text(); 
        var resultAuthor = $(this).children('.pr-review-author').children('.pr-review-author-info-wrapper').children('.pr-review-author-name').children('span').text(); 
        var resultLocation = $(this).children('.pr-review-author').children('.pr-review-author-info-wrapper').children('.pr-review-author-location').children('span').text(); 
        var resultDescription = $(this).children('.pr-review-main-wrapper').children('.pr-review-text').children('.pr-comments').text(); 
        var resultDate = $(this).children('.pr-review-rating-wrapper').children('.pr-review-author-date').text(); 

        var resultDateSplit = resultDate.split("/");
        var day = resultDateSplit[0];
        var month = resultDateSplit[1] - 1;
        var year = resultDateSplit[2];
        var newdate = new Date(year,month,day);
        var dateReview = newdate.getTime();

        var review = new Review ({
          title: resultTitle,
          description: resultDescription,
          author: resultAuthor,
          location: resultLocation,
          date: dateReview,
          category: offer.category,
          url: offer.url,
          advertiser: offer.advertiser,
          manufacturer :offer.manufacturer,
          ean: offer.ean,
          rating: resultRating
        });
       
        //review.title = review.title.replace(/['"]+/g,'');// jshint ignore:line
        //review.description = review.description.replace(/['"]+/g, '');
        //review.location = review.location.replace(new RegExp('\r?\n','g'), ' ');

        console.log("Review from offer ean >> ",offer.ean);
        console.log("review >> ",i," >> ");
        console.log(review);
        console.log('\n');
        reviews.push(review);
    });

    return next(reviews);

  }catch(error){
    console.log('An error has occurred >> extra.server.controller >>  getReviewsFromHtml : '+ error.message);
    throw error ;
  }
};



exports.getProductContext = getProductContext;
exports.setDataProducts = setDataProducts;
exports.crawlerByProduct = crawlerByProduct;
exports.getReviewsFromHtml = getReviewsFromHtml;
exports.crawlerByReviewPagination = crawlerByReviewPagination;
