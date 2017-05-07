var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var reviewController = require('./review.server.controller.js');
var ZanoxMerchant = require('../../config/merchants/zanox.merchant.js');
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var config = require('../../config/config.js');
var contReview = 0;
var callPhantom = new phantomUtile();
var async = require('async');
var productController = require('./product.server.controller.js');


var getProductContext = function(body,next){
  
  try{

    $ = cheerio.load(body);

    var productid = $('.codigo-produto').text();
    var productid_split_final;
    var totalPaginacaoReviews;

    if((productid === undefined) || (productid === '')) {

      productid_split_final = 0;
      totalPaginacaoReviews = 0;

      return next(productid_split_final,totalPaginacaoReviews);

    }else{

      var productid_split = productid.match(/\d+|\D+/g);
      productid_split_final = productid_split[1];
      var paginacao = 1;

      getJson(productid_split_final,paginacao,function(data){

        //console.log(data);
        totalPaginacaoReviews = data.paginacao.totalpaginas;
        console.log("totalPaginacaoReviews >> ",totalPaginacaoReviews);
        console.log("productid >> ",productid_split_final);

        return next(productid_split_final,totalPaginacaoReviews);
      });
      
    }
    
  }catch(e){
    console.log('An error has occurred >> getProductContext >> '+ e.message);
  }
};


var setDataProducts = function(offer,next){
	
	try{

		    var urlToCrawler = ZanoxMerchant.lojas_colombo + offer.urlOffer;
		    console.log("offer >> ",offer.name);
		    console.log("urlToCrawler >> ",urlToCrawler);

        callPhantom.getHtml(urlToCrawler,config.timeRequest,function(body){

            getProductContext(body,function(productid,totalPaginacaoReviews){

               if((totalPaginacaoReviews > 0) && (offer.ean !== undefined)){

                  console.log("advertiser >> ", offer.advertiser);
                  console.log("offer dataProductId >> ",productid);
                  console.log("offer totalPaginacaoReviews >> ",totalPaginacaoReviews);
                  console.log('\n');

                  return next(productid,totalPaginacaoReviews);
               }else{
                console.log("offer without ean or with total reviews < 0");
                console.log('\n');
                
                return next(null);

               }
            });
      });

	}catch(e){
		console.log('An error has occurred >> setDataProducts >> '+ e.message);
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
          setDataProducts(offer,function(productid,totalPaginacaoReviews){
              callback(null,offer,productid,totalPaginacaoReviews); 
          });
        },
        // step_02 >> crawlerByReviewPagination
        function(offer,productid,totalPaginacaoReviews,callback){
          // for each review pagination
          var currentPaginationReview = 1;
          crawlerByReviewPagination(offer,currentPaginationReview,productid,totalPaginacaoReviews,function(){
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
            crawlerByProduct(currentItem + 1,arrayOffers,next);
          }
      });
    }else{
      return next(contReview);
    }
  }catch(e){
    console.log('An error has occurred >> crawlerByProduct >>'+ e.message);
  }
};


var crawlerByReviewPagination = function(offer,currentPaginationReview,productid,totalPaginacaoReviews,next){
  

  try{
      // for each review pagination
    if(currentPaginationReview <= totalPaginacaoReviews){

      getJson(productid,currentPaginationReview,function(data){

        getReviewsFromJson(data,offer,function(reviews){
        
          var currentItemArray = 0;
            
          reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
            contReview = contReview + arrayReviews.length;
            crawlerByReviewPagination(offer,currentPaginationReview+1,productid,totalPaginacaoReviews,next);
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


var getReviewsFromJson = function(data,offer,next){

	try{
		var reviews = [];

		for (var i = 0; i < data.avaliacoesPagina.length; i++){

      var value = data.avaliacoesPagina[i];

  		var review = new Review ({
          title: value.titulo,
          description: value.conteudo,
          author: value.usuario,
          location: "",
          date: value.data,
          category: offer.category,
          url: offer.url,
          advertiser : offer.advertiser,
          manufacturer : offer.manufacturer,
          ean : offer.ean,
          rating: value.nota
  		});
      
      var temp_date = review.date.split("/");
      var year = temp_date[2];
      var month = temp_date[1] - 1;
      var day = temp_date[0];
       // (year, month, day, hours, minutes, seconds, milliseconds)
      var newdate = new Date(year,month,day);
      var dateReview = newdate.getTime();
        
      review.date = dateReview;
      review.title = review.title.replace(new RegExp('\r?\n','g'), ' ');
      review.description = review.description.replace(new RegExp('\r?\n','g'), ' ');
      review.location = review.location.replace(new RegExp('\r?\n','g'), ' ');

		  console.log("Review from product ean >> ",offer.ean);
      console.log("review >> ",i," >> ");
      console.log(review);
      console.log('\n');

    	reviews.push(review);
		}

		return next(reviews);

	}catch(e){
		console.log('An error has occurred >> getReviewsFromJson >> '+ e.message);
	}
	
};



var getJson = function(productid,pagination,next){
	try{
		var url = "https://www.colombo.com.br/avaliacao-pagina?codProd=" + productid + "&pagina=" + pagination + "&ordemAvaliacao=1";
    console.log("getJson >> url >>",url);
		var call = new requestUtile();
		call.getJson(url,config.timeRequest,function(error,response,data){
			return next(data);
		});
	}catch(e){
		console.log('An error has occurred >> getJson >> '+ e.message);
	}
	
};


exports.getProductContext = getProductContext;
exports.setDataProducts = setDataProducts;
exports.getJson = getJson;
exports.getReviewsFromJson = getReviewsFromJson;
exports.crawlerByProduct = crawlerByProduct;

