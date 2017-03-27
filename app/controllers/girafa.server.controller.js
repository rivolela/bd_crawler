var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var config = require('../../config/config.js');
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var reviewController = require('./review.server.controller.js');
var contReview = 0;
var callPhantom = new phantomUtile();


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

		    return next(totalReviews);
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
    		
    		var resultDate_02 = resultDate_01[0].match(/\d+|\D+/g);
    		// [ '01', '/', '05', '/', '2015' ]
    		
    		var year = resultDate_02[5];
        	var month = resultDate_02[3] - 1;
        	var day = resultDate_02[1];

        	var resultHour = resultDate_01[2].split(":");
        	var hour = resultHour[0];
        	var min = resultHour[1];

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
	       
	        //review.title = review.title.replace(/['"]+/g,'');// jshint ignore:line
	        //review.description = review.description.replace(/['"]+/g, '');
	        //review.location = review.location.replace(new RegExp('\r?\n','g'), ' ');

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


exports.getTotalReviews = getTotalReviews;
exports.parseUrlCrawler = parseUrlCrawler;
exports.getReviewsFromHtml = getReviewsFromHtml;

