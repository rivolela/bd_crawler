var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var config = require('../../config/config.js');
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var iconv = require('iconv-lite');
var reviewController = require('./review.server.controller.js');
var contReview = 0;
var callPhantom = new phantomUtile();


var getProductId = function(urlToCrawler,next){
  
  try{
    var call = new requestUtile();

    call.getHtmlGzip(urlToCrawler,config.timeRequest,function(error,response,body){
        $ = cheerio.load(body);
        var productid = $('.comentarios-avaliacao').attr('produtoid');
        if(productid === undefined){
          productid = 0;
        }
        return next(productid);
    });
  }catch(e){
    console.log('An error has occurred >> getProductId >> '+ e.message);
  }
};


var getTotalPagination = function(dataProductId,next){

  try{

    var call = new requestUtile();
    var urlToCrawler = 'http://www.ricardoeletro.com.br/Produto/Comentarios/'+ dataProductId + '/' + 0;

    call.getHtmlGzip(urlToCrawler,config.timeRequest,function(error,response,body){

        $ = cheerio.load(body);
        var totalPaginacaoReviews = $('#SetaComentariosDireita').attr('paginatotal');
        
        if(totalPaginacaoReviews === undefined){
          totalPaginacaoReviews = 0;
        }

        return next(totalPaginacaoReviews);
    });
  }catch(e){
    console.log('An error has occurred >> getTotalPagination >> '+ e.message);
  }
};



var setProductIdArrayProducts = function(currentItem,arrayProducts,next){

  try{

    if(currentItem < arrayProducts.length){

        var urlToCrawler = config.ricardo_eletro_url + arrayProducts[currentItem].urlOffer;

        console.log("urlToCrawler",urlToCrawler);

        getProductId(urlToCrawler,function(dataProductId){
          
          arrayProducts[currentItem].dataProductId = dataProductId;

          console.log("offer >> ",currentItem);
          console.log("Product ean >> ",arrayProducts[currentItem].ean);
          console.log("advertiser >> ", arrayProducts[currentItem].advertiser);
          console.log("offer url >> ",urlToCrawler);
          console.log("set ProductId to offer >> ",arrayProducts[currentItem].dataProductId);
          console.log('\n');

          setProductIdArrayProducts(currentItem+1,arrayProducts,next);
      });
    }else{
      return next(arrayProducts);
    }
  }catch(e){
    console.log('An error has occurred >> setProductIdArrayProducts >> '+ e.message);
  }
 
};


var setTotalPaginationArrayProducts = function(currentItem,arrayProducts,next){

  try{

    if(currentItem < arrayProducts.length){

          var dataProductId = arrayProducts[currentItem].dataProductId;

          getTotalPagination(dataProductId,function(totalPaginacaoReviews){

            if((totalPaginacaoReviews > 0) && (arrayProducts[currentItem].ean !== undefined)){

              arrayProducts[currentItem].totalPaginacaoReviews = totalPaginacaoReviews;

              console.log("offer >> ",currentItem);
              console.log("Product ean >> ",arrayProducts[currentItem].ean);
              console.log("offer url >> ",arrayProducts[currentItem].url);
              console.log("set totalPaginacaoReviews to offer>> ", arrayProducts[currentItem].totalPaginacaoReviews);
              console.log('\n');

              setTotalPaginationArrayProducts(currentItem+1,arrayProducts,next);
            
            }else{
              console.log("offer without ean or with total reviews < 0");
              console.log('\n');
              setTotalPaginationArrayProducts(currentItem+1,arrayProducts,next);
            }
         });

    }else{
      return next(arrayProducts);
    }
  }catch(e){
    console.log('An error has occurred >> setTotalPaginationArrayProducts >> '+ e.message);
  }
 
};


var crawlerByProduct = function(currentItem,arrayProductsRicardo,next){

    try{
      // for each product
      if(currentItem < arrayProductsRicardo.length){

          var currentPaginationReview = 0;
          
          crawlerByReviewPagination(currentItem,currentPaginationReview,arrayProductsRicardo,function(contReview){
            console.log('total of reviews saved at the moment >> ',contReview);
            crawlerByProduct(currentItem + 1,arrayProductsRicardo,next);
          });
       
      }else{
        return next(contReview);
      }
    }catch(e){
      console.log('An error has occurred >> crawlerByProduct >> '+ e.message);
    }
};


var crawlerByReviewPagination = function(currentItem,currentPaginationReview,arrayProductsRicardo,next){
  
  var productReview = arrayProductsRicardo[currentItem];

  try{
      // for each review pagination
    if(currentPaginationReview <= arrayProductsRicardo[currentItem].totalPaginacaoReviews){

      var dataProductId = arrayProductsRicardo[currentItem].dataProductId;
      var urlToCrawler = 'http://www.ricardoeletro.com.br/Produto/Comentarios/'+ dataProductId + '/' + currentPaginationReview;

      callPhantom.getHtml(urlToCrawler,config.timeRequest,function(body){ // jshint ignore:line

        getReviewsFromHtml(body,productReview,function(reviews){
          
          var currentItemArray = 0;
            
          reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
            contReview = contReview + arrayReviews.length;
            crawlerByReviewPagination(currentItem,currentPaginationReview+1,arrayProductsRicardo,next);
          });

        });
      });

    }else{
      return next(contReview);
    }

  }catch(e){
    console.log('An error has occurred >> getReviewsByPagination '+ e.message);
  }
};


var getReviewsFromHtml = function(body,product,next){

  try{

    var reviews = [];
    
    $ = cheerio.load(body);
    console.log(body);

    $('.linha-comentario').each(function(i, elem) {
        
        var textCondensed =  $(this).children('.nome-comentario').text();
        // 'Alcione Milbratz, NOVA VENECIA - ES 19/09/2013 - 15:03:41 escreveu:'

        var textCondensed_break_up_01 = textCondensed.split("escreveu:");
        // [ 'Alcione Milbratz, NOVA VENECIA - ES 19/09/2013 - 15:03:41 ',
        //'' ]

        var textCondensed_break_up_02 = textCondensed_break_up_01[0].split(",");
        // [ 'Alcione Milbratz',
        // ' NOVA VENECIA - ES 19/09/2013 - 15:03:41 escreveu:' ]

        var resultAuthorReview = textCondensed_break_up_02[0];

        var textCondensed_break_up_03 = textCondensed_break_up_02[1].split("-");
        //[ ' NOVA VENECIA ', ' ES 19/09/2013 ', ' 15:03:41 ' ] 

        var textCondensed_break_up_04 = textCondensed_break_up_03[1].match(/\d+|\D+/g);
        //[ ' ES ', '19', '/', '09', '/', '2013', ' ' ]

        var resultLocal = textCondensed_break_up_03[0] + '-' + textCondensed_break_up_04[0];
        // var resultAuthor_2 = resultAuthor[1].split(" ");
        // var resultLocal = resultAuthor_2[1] + ' - ' + resultAuthor_2[3];
        // var resultDate = resultAuthor_2[4].split("/");
        
        var resultTitle = "Review de " + resultAuthorReview;

        var year = textCondensed_break_up_04[5];
        var month = textCondensed_break_up_04[3] - 1;
        var day = textCondensed_break_up_04[1];

        var resultHour = textCondensed_break_up_03[2].split(":");
        var hour = resultHour[0];
        var min = resultHour[1];
        var sec = resultHour[2];

        // (year, month, day, hours, minutes, seconds, milliseconds)
        var newdate = new Date(year,month,day,hour,min,sec,0);
        var dateReview = newdate.getTime();
        
        var description =  $(this).children('.texto-comentario').text();
       
        var countRating = 0;

         $(this).children('.nome-comentario').each(function(i, elem) {
            var countStarFull = $(this).children('.starmini_cheia').length;
            var countStarHalfFull = $(this).children('.starmini_media').length;
            countRating = countStarFull + countStarHalfFull;
         });


        var review = new Review ({
          title:resultTitle,
          description: description,
          author: resultAuthorReview,
          location: resultLocal,
          date: dateReview,
          category:product.category,
          url:product.url,
          advertiser :product.advertiser,
          manufacturer :product.manufacturer,
          ean :product.ean,
          rating: countRating
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
    console.log(error);
    console.log('An error has occurred >> ricardo_eletro.server.controller >>  getReviewsFromHtml : '+ error.message);
    throw error ;
  }
};


exports.getProductId = getProductId;
// exports.setDataProducts = setDataProducts;
exports.getReviewsFromHtml = getReviewsFromHtml;
exports.crawlerByProduct = crawlerByProduct;
exports.getTotalPagination = getTotalPagination;
exports.setProductIdArrayProducts = setProductIdArrayProducts;
exports.setTotalPaginationArrayProducts = setTotalPaginationArrayProducts;
