var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
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
    console.log('An error has occurred >> ponto_frio.server.controller >> getProductContext >> '+ e.message);
  }
};


var setDataProducts = function(currentItem,arrayProducts,next){

    try{

      if(currentItem < arrayProducts.length){

        var nameOffer = arrayProducts[currentItem].name;
        var idOffer = arrayProducts[currentItem].merchantProductId;

        var urlToCrawler =  config.ponto_frio_url + nameOffer + '-' + idOffer + ".html";
        // remove double quotes
        var result_urlToCrawler = urlToCrawler.replace(/\”/g, "");
                  
        console.log("offer >> ",currentItem);
        console.log("urlToCrawler >> ",result_urlToCrawler);

        call.getHtml(result_urlToCrawler,config.timeRequest,function(error,response,body){
          if(error){
              console.log("error setDataProducts:",error);
              setDataProducts(currentItem+1,arrayProducts,next);
          }else{
          
            getProductContext(body,function(totalPaginacaoReviews){

              if((totalPaginacaoReviews > 0) && (arrayProducts[currentItem].ean !== undefined)){

                arrayProducts[currentItem].totalPaginacaoReviews = totalPaginacaoReviews;
                console.log("Product ean >> ",arrayProducts[currentItem].ean);
                console.log("advertiser >> ", arrayProducts[currentItem].advertiser);
                console.log("adding attribute totalPaginacaoReviews >> ", arrayProducts[currentItem].totalPaginacaoReviews);
                console.log('\n');

                setDataProducts(currentItem+1,arrayProducts,next);

              }else{
                console.log("offer without ean or with total reviews < 0");
                console.log('\n');
                setDataProducts(currentItem+1,arrayProducts,next);
              }

            });
          }
        });

      }else{
        return next(arrayProducts);
      }

    }catch(e){
      console.log('An error has occurred >> ponto_frio.server.controller >> setDataProducts >>'+ e.message);
    }
};


var crawlerByProduct = function(currentItem,arrayProductsReview,next){

	try{
	    // for each product
	    if(currentItem < arrayProductsReview.length) {
	      
	       var currentPaginationReview = 1;
	      
	       crawlerByReviewPagination(currentItem,currentPaginationReview,arrayProductsReview,function(contReview){
	           console.log('total of reviews saved at the moment >> ',contReview);
             console.log('\n');
	           crawlerByProduct(currentItem + 1,arrayProductsReview,next);
	       });

	    }else{
	      return next(contReview);
	    }
	}catch(e){
	    console.log('An error has occurred >> ponto_frio.server.controller >> crawlerByProduct >>'+ e.message);
	}
};


var crawlerByReviewPagination = function(currentItem,currentPaginationReview,arrayProductsReview,next){
  
  var productReview = arrayProductsReview[currentItem];

  try{
      // for each review pagination
    if(currentPaginationReview <= 1){

	    var urlToCrawler = 	config.ponto_frio_url +
	    					          productReview.name + '-' +
	    					          productReview.merchantProductId + ".html";

      // remove double quotes
      var result_urlToCrawler = urlToCrawler.replace(/\”/g, "");

      console.log("urlToCrawler",result_urlToCrawler);

      call.getHtml(result_urlToCrawler,config.timeRequest,function(error,response,body){

         if(error){
              console.log("error crawlerByReviewPagination:",error);
              crawlerByReviewPagination(currentItem,currentPaginationReview+1,arrayProductsReview,next);
          }else{

            getReviewsFromHtml(body,productReview,function(reviews){
        
              var currentItemArray = 0;
            
              reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
                contReview = contReview + arrayReviews.length;
                crawlerByReviewPagination(currentItem,currentPaginationReview+1,arrayProductsReview,next);
                });
              });
          }
      });

    }else{
      return next(contReview);
    }

  }catch(e){
    console.log('An error has occurred >> ponto_frio.server.controller >> getReviewsByPagination '+ e.message);
  }
};


var getReviewsFromHtml = function(body,product,next){

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
          category: product.category,
          url: product.url,
          advertiser: product.advertiser,
          manufacturer :product.manufacturer,
          ean: product.ean,
          rating: resultRating
        });
       
        //review.title = review.title.replace(/['"]+/g,'');// jshint ignore:line
        //review.description = review.description.replace(/['"]+/g, '');
        //review.location = review.location.replace(new RegExp('\r?\n','g'), ' ');

        console.log("Review from product ean >> ",product.ean);
        console.log("review >> ",i," >> ");
        console.log(review);
        console.log('\n');
        reviews.push(review);
    });

    return next(reviews);

  }catch(error){
    console.log('An error has occurred >> ponto_frio.server.controller >>  getReviewsFromHtml : '+ error.message);
    throw error ;
  }
};



exports.getProductContext = getProductContext;
exports.setDataProducts = setDataProducts;
exports.crawlerByProduct = crawlerByProduct;
exports.getReviewsFromHtml = getReviewsFromHtml;
exports.crawlerByReviewPagination = crawlerByReviewPagination;
