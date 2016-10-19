var cheerio = require('cheerio');
var requestUtile = require('../utile/requests.server.utile.js');
var phantomUtile = require('../utile/phantomjs.server.utile.js');
var reviewController = require('./review.server.controller.js');
var mongoose = require('mongoose');
var ReviewSchema = require('../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var config = require('../../config/config.js');
var contReview = 0;

var getProductContext = function(body,next){
  
  try{

    $ = cheerio.load(body);

    var productid = $('.codigo-produto').text();
    var productid_split = productid.match(/\d+|\D+/g);
    var productid_split_final = productid_split[1];
	  var paginacao = 1;

    getJson(productid_split_final,paginacao,function(data){

     	//console.log(data);
    	var totalPaginacaoReviews = data.paginacao.totalpaginas;
    	console.log("totalPaginacaoReviews >> ",totalPaginacaoReviews);
    	console.log("productid >> ",productid_split_final);

    	return next(productid_split_final,totalPaginacaoReviews);
    });
  }catch(e){
    console.log('An error has occurred >> getProductContext >> '+ e.message);
  }
};


var setDataProducts = function(currentItem,arrayProducts,next){
	
	try{
		if(currentItem < arrayProducts.length){

		    var urlToCrawler = config.lojas_colombo + arrayProducts[currentItem].urlOffer;
		    console.log("offer >> ",currentItem);
		    console.log("urlToCrawler >> ",urlToCrawler);

		    getBodyProductPage(urlToCrawler,function(body){
		       
		      getProductContext(body,function(productid,totalPaginacaoReviews){

		          arrayProducts[currentItem].dataProductId = productid;
		          arrayProducts[currentItem].totalPaginacaoReviews = totalPaginacaoReviews;
		          console.log("Product ean >> ",arrayProducts[currentItem].ean);
		          console.log("adding attribute dataProductId >> ",arrayProducts[currentItem].dataProductId);
		          console.log("adding attribute totalPaginacaoReviews >> ", arrayProducts[currentItem].totalPaginacaoReviews);
		          console.log('\n');
		          setDataProducts(currentItem+1,arrayProducts,next);
		      });

		    });
        
		 }else{
		 	return next(arrayProducts);
		 }
	}catch(e){
		console.log('An error has occurred >> setDataProducts >> '+ e.message);
	}
};


var getBodyProductPage = function(urlToCrawler,next){

  try{
    if(process.env.NODE_ENV != 'test'){
      var call = new phantomUtile();
      call.getHtml(urlToCrawler,config.timeRequest,function(body){
        console.log("get body html by phantomjs");
        return next(body);
      });
    }else{
      // this conditional exists because phantomjs doesnt work wtih mocha ( test environment )
      // the url crawler was saved by casperjs ( see test task inside gruntfile), into the public folder
      // therefore, to env test, the product page used always will be the same, the file saved by casperjs test
      var call2 = new requestUtile();
      var timeRequest = 0;
      call2.getHtml(urlToCrawler,timeRequest,function(error,response,body){
        console.log("get body html by request");
        return next(body);
      });
    }
  }catch(e){
    console.log('An error has occurred >> getBodyProductPage >> '+ e.message);
  }
};


var crawlerByProduct = function(currentItem,arrayProducts,next){

  try{
    // for each product
    if(currentItem < arrayProducts.length){

      if(arrayProducts[currentItem].totalPaginacaoReviews > 0){
      
        var currentPaginationReview = 1;
      
        crawlerByReviewPagination(currentItem,currentPaginationReview,arrayProducts,function(contReview){
          console.log('total of reviews saved at the moment >> ',contReview);
          crawlerByProduct(currentItem + 1,arrayProducts,next);
        });
      }else{
        crawlerByProduct(currentItem + 1,arrayProducts,next);
      }

    }else{
      return next(contReview);
    }
  }catch(e){
    console.log('An error has occurred >> crawlerByProduct >>'+ e.message);
  }
};


var crawlerByReviewPagination = function(currentItem,currentPaginationReview,arrayProducts,next){
  
  var productReview = arrayProducts[currentItem];

  try{
      // for each review pagination
    if(currentPaginationReview <= arrayProducts[currentItem].totalPaginacaoReviews){

      var dataProductId = arrayProducts[currentItem].dataProductId;

      getJson(dataProductId,currentPaginationReview,function(data){

        getReviewsFromJson(data,productReview,function(reviews){
        
          var currentItemArray = 0;
            
          reviewController.saveArrayReviews(currentItemArray,reviews,function(arrayReviews){
            contReview = contReview + arrayReviews.length;
            crawlerByReviewPagination(currentItem,currentPaginationReview+1,arrayProducts,next);
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


var getReviewsFromJson = function(data,productReview,next){

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
          category: productReview.category,
          url: productReview.url,
          advertiser : productReview.advertiser,
          manufacturer : productReview.manufacturer,
          ean : productReview.ean,
          rating: value.nota
  		});
      
      var temp_date = review.date.split("/");
      var year = temp_date[2];
      var month = temp_date[1] - 1;
      var day = temp_date[0];
       // (year, month, day, hours, minutes, seconds, milliseconds)
      var newdate = new Date(year,month,day);
      var dateReview = newdate.getTime();
        
      review.date = newdate;
      review.title = review.title.replace(new RegExp('\r?\n','g'), ' ');
      review.description = review.description.replace(new RegExp('\r?\n','g'), ' ');
      review.location = review.location.replace(new RegExp('\r?\n','g'), ' ');

		  console.log("Review from product ean >> ",productReview.ean);
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
		call.getJson(url,config.timeRequest,function(data){
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

