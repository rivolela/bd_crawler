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
var productController = require('./product.server.controller.js');

/**
 * [getTotalReviews description]
 * @param  {String} urlToCrawler  [url store]
 * @param  {Function} next  [callback]
 * @return {String} totalReviews  [total of reviews from product page]
 */
var getTotalReviews = function(urlToCrawler,next){
 
	try{
		var call = new requestUtile();

		call.getHtmlGzip(urlToCrawler,config.timeRequest,function(error,response,body){

		    $ = cheerio.load(body);
		    var totalReviews = $('span[itemprop=aggregateRating]').children('meta[itemprop=reviewCount]').attr('content');
		    // var totalReviewsPage = $('#rating').children('.star-rating-review-amount').children('meta[itemprop=ratingCount]').attr('content');
		    
		    if(totalReviews === undefined){
		      totalReviews = 0;
		    }

		    return next(totalReviews,body);
		});
	}catch(e){
		console.log('An error has occurred >> getTotalReviews >> '+ e.message);
	}
};

/**
 * [parseUrlCrawler description]
 * @param  {String}   urlToParser [url zanox]
 * @param  {Function} next        [description]
 * @return {String}   urlParsed   [url splitted from zanox info]
 */
var parseUrlCrawler = function(urlToParser,next){
 	
	try{
		var removeAnd = urlToParser.split("&");
		var removeAferQueryString = removeAnd[1].split("?");
		var removePrefix = removeAferQueryString[0].split("ULP=[[");
		var urlParsed = removePrefix[1];
   		return next(urlParsed);
  	}catch(e){
    	console.log('An error has occurred >> urlParsed >> '+ e.message);
  	}
};


/**
 * [getReviewsFromHtml >> crawler reviews from offer html page]
 * @param  {html}   body      [offer html page] 
 * @param  {json}   product   [json of offer]
 * @param  {Function} next    [callback]
 * @return {array}    reviews [array of reviews from offer html page]
 */
var getReviewsFromHtml = function(body,product,next){

	try{

		var reviews = [];
    
    	$ = cheerio.load(body);

    	$('ul[itemprop=review]').children('li').each(function(i, elem) {

    		var resultDescription =  $(this).children('blockquote[itemprop=description]').text();
    		var resultDescription_1 = resultDescription.replace(/['"]+/g, '');

    		var resultAuthor =  $(this).children('h4[itemprop=author]').text();

    		var resultRating = $(this).children('span[itemprop=reviewRating]').children('meta[itemprop=ratingValue]').attr('content');

    		var resultDate =  $(this).children('h6[itemprop=datePublished]').text();
    		//01/05/2015 às 21:02
    		
    		var resultDate_01 = resultDate.split(" ");
    		// [ '01/05/2015', 'às', '21:02' ]
    		
    		var resultDate_02 = resultDate_01[0].split("/");
    		console.log("resultDate_02",resultDate_02);
    		// [ '01', '05', '2015' ]
    		
    		var year = Number(resultDate_02[2]);
        	var month = Number(resultDate_02[1]);
        	var day = Number(resultDate_02[0]);
        	var resultHour = resultDate_01[2].split(":");
        	var hour = Number(resultHour[0]);
        	var min = Number(resultHour[1]);

        	// (year, month, day, hours, minutes, seconds, milliseconds)
        	var newdate = new Date(year,month,day,hour,min,0,0);
        	var dateReview = newdate.getTime();

	        var review = new Review ({
	          title:"Review de " + resultAuthor,
	          description: resultDescription_1,
	          author: resultAuthor,
	          // location: resultLocal,
	          date: dateReview,
	          advertiser :product.advertiser,
	          manufacturer :product.manufacturer,
	          ean :product.ean,
	          rating: resultRating
	        });
	       
	        // console.log("Review from product ean >> ",product.ean);
	        console.log("review >> ",i," >> ");
	        console.log(review);
	        console.log('\n');

	        reviews.push(review);

    	});

    	return next(reviews);

	}catch(error){
    	console.log(error);
    	console.log('An error has occurred >> getReviewsFromHtml >>  : '+ error.message);
    	throw error ;
  	}
};


/**
 * [crawlerPage >> control do get reviews from html and save them in bd]
 * @param  {Number}   currentItem  [item to be interacted in recursive function]
 * @param  {Array}   arrayProducts [array of offers]
 * @param  {Function} next         [callback]
 * @return {Number}   contReview   [total reviews saved]
 */
var crawlerPage = function(currentItem,arrayProducts,next){
  
  try{
  	  // for each product
      if(currentItem < arrayProducts.length){

        var offer = arrayProducts[currentItem];

        async.waterfall([
          // step_01 >> get total of reviews
          function(callback){            
            var urlToCrawler = ZanoxMerchant.girafa_url + arrayProducts[currentItem].urlOffer;
            getTotalReviews(urlToCrawler,function(totalReviews,body){
              callback(null,totalReviews,body);   
            });
          },
          // step_02 >> set offer's url
          function(totalReviews,body,callback){
            console.log('total reviews >> ',totalReviews);
            if(totalReviews === 0){
              callback('offer without reviews','arg');
            }else{
              callback(null,body); 
            }
          },
          // step_03 >> crawler reviews page
          function(body, callback) {
            var offer = arrayProducts[currentItem];
            getReviewsFromHtml(body,offer,function(arrayReviews){
              callback(null,arrayReviews);
            });
          },
          // step_04 >> save reviews in bd
          function(arrayReviews,callback){
              var currentItemArray = 0;
              reviewController.saveArrayReviews(currentItemArray,arrayReviews,function(reviews){
              contReview = contReview + reviews.length;
              callback(null,'arg');
            });
          },
          // step_05 >> update product
          function(arg,callback){
            productController.updateProductReviews(offer,function(){
              callback(null,'product updated'); 
            });
          },
          ], function (err, result) {
            if(err){
              console.log("err >>",err);
              crawlerPage(currentItem+1,arrayProducts,next);     
            }else{
              crawlerPage(currentItem+1,arrayProducts,next);
            }
        });
      }else{
      	 return next(contReview);
      }
  }catch(e){
    console.log('An error has occurred >> crawlerPage '+ e.message);
  }
};


exports.getTotalReviews = getTotalReviews;
exports.parseUrlCrawler = parseUrlCrawler;
exports.getReviewsFromHtml = getReviewsFromHtml;
exports.crawlerPage = crawlerPage;


