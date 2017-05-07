var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var StringUtile = require('../utile/string.server.utile.js');
var ZanoxMerchant = require('../../config/merchants/zanox.merchant.js');
var reviewController = require('./review.server.controller.js');
var productController = require('./product.server.controller.js');
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var config = require('../../config/config.js');
var contReview = 0;
var contReviewsPagination;
var request = require('request').defaults({maxRedirects:20});
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
    console.log('An error has occurred >> nova_ponto_com.controller >> getProductContext >> '+ e.message);
  }
};


/**
 * [setUrlCrawler remove double and single quotes of url's crawler]
 * @param {String}   url  [description]
 * @param {Function} next [description]
 */
var getUrlCrawler = function(offer,next){

  try{
    var nameOffer = offer.name;

    // remove caracteres especiais
    var clean_name_01 = nameOffer.replace(/[^\w\s]/gi, '');

    // remove accents
    var clean_name_02 = clean_name_01.removerAcento();

    var idOffer = offer.merchantProductId;
    var urlToCrawler;

    switch(offer.advertiser) {
      case 'Casas Bahia BR':
        urlToCrawler =  ZanoxMerchant.casas_bahia_url + clean_name_02 + '-' + idOffer + ".html";
      break;
      case 'Extra BR':
        urlToCrawler =  ZanoxMerchant.extra_url + clean_name_02 + '-' + idOffer + ".html";
      break;
      case 'Pontofrio BR':
        urlToCrawler =  ZanoxMerchant.ponto_frio_url + clean_name_02 + '-' + idOffer + ".html";
      break;
      // default:
      //   urlToCrawler =  ZanoxMerchant.ponto_frio_url + nameOffer + '-' + idOffer + ".html";
    }

     // remove accents
    var result_url = urlToCrawler.removerAcento();

    return next(result_url);

  }catch(e){
    console.log('An error has occurred >> nova_ponto_com.controller >> setUrlCrawler >>'+ e.message);
  }
};


var setDataProducts = function(offer,next){

    try{

         async.waterfall([
          // step_01 >> set url crawler
          function(callback){
            getUrlCrawler(offer,function(url){
              callback(null,url); 
            });
          },
          // step_02 >> get html crawler's url
          function(url,callback){
            call.getHtml(url,config.timeRequest,function(error,response,body){
              if(error){
                console.log("error setDataProducts >> ",error);
                callback(error,null); 
              }else{
                callback(null,body);
              }
            });
          },
          // step_03 >> get total pagination
          function(body,callback){

            getProductContext(body,function(totalPaginacaoReviews){

              if((totalPaginacaoReviews > 0) && (offer.ean !== undefined)){

                console.log("Product ean >> ",offer.ean);
                console.log("advertiser >> ", offer.advertiser);
                console.log("totalPaginacaoReviews >> ", totalPaginacaoReviews);
                console.log('\n');

                callback(null,totalPaginacaoReviews); 

              }else{
                console.log("offer without ean or with total reviews < 0");
                console.log('\n');
                callback(null); 
              }

            });
          },
          ], function (err, result) {
            if(err){
              console.log("err >>",err);
              return next(null);     
            }else{
              return next(result); 
            }
        });
      
    }catch(e){
      console.log('An error has occurred >> nova_ponto_com.controller >> setDataProducts >>'+ e.message);
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
              if(totalPaginacaoReviews === null){
                callback('error setDataProduct >> ',null); 
              }else{
                callback(null,offer,totalPaginacaoReviews); 
              }         
            });
          },
          // step_02 >> crawlerByReviewPagination
          function(offer,totalPaginacaoReviews,callback){
            // for each review pagination
            var currentPaginationReview = 1;
            contReviewsPagination = 0;
            crawlerByReviewPagination(offer,currentPaginationReview,function(){
              // contReview = contReview + resultReviewsPagination;
              // console.log('total of reviews saved at the moment >> ',contReview);
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
              console.log("result >>",result);
              crawlerByProduct(currentItem + 1,arrayOffers,next);
            }
        });
      }else{
        return next(contReview);
      }
}catch(e){
	    console.log('An error has occurred >> nova_ponto_com.controller >> crawlerByProduct >>'+ e.message);
	}
};



var crawlerByReviewPagination = function(offer,currentPaginationReview,next){
  

  try{
      // for each review pagination
    if(currentPaginationReview <= 1){

      async.waterfall([
        // step_01 >> get url crawler
        function(callback){
          getUrlCrawler(offer,function(url){
            callback(null,url); 
          });
        },
        // step_02 >> get html crawler's pagination url
        function(url,callback){
          var call = new requestUtile();
          call.getHtml(url,config.timeRequest,function(error,response,body){
              if(error){
                console.log("error getHtml >> ",error);
                callback(null); 
              }else{
                callback(null,body);
              }
          });
        },
        // step_03 >> get reviews from html
        function(body,callback){
          getReviewsFromHtml(body,offer,function(reviews){
             callback(null,reviews);
           });
        },
        // step_03 >> save reviews
        function(reviews,callback){

          var currentItemArray = 0;
          
          reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
              contReview = contReview + arrayReviews.length;
              callback(null,contReview);
          });
        },
        ], function (err, result) {
          if(err){
            console.log("err crawlerByReviewPagination >>",err);
            crawlerByReviewPagination(offer,currentPaginationReview+1,next);  
          }else{
            console.log("total reviews saved at the moment >>",contReview);
            crawlerByReviewPagination(offer,currentPaginationReview+1,next);
          }
      });
    
    }else{
      return next();
    }

  }catch(e){
    console.log('An error has occurred >> nova_ponto_com.controller >> getReviewsByPagination '+ e.message);
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
    console.log('An error has occurred >> nova_ponto_com.controller >>  getReviewsFromHtml : '+ error.message);
    throw error ;
  }
};



exports.getProductContext = getProductContext;
exports.setDataProducts = setDataProducts;
exports.crawlerByProduct = crawlerByProduct;
exports.getReviewsFromHtml = getReviewsFromHtml;
exports.crawlerByReviewPagination = crawlerByReviewPagination;
