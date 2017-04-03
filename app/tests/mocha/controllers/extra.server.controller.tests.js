var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html ='http://www.extra.com.br/Eletroportateis/Batedeiras/batedeira/Batedeira-Mondial-Bella-Massa-B-23-com-4-Velocidades-Turbo-2-Tigelas-4L-e-23L-Preto-3480193.html?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletroportateis_Batedeira&utm_content=3480194&cm_mmc=zanox_XML-_-ELPO-_-Comparador-_-3480194&zanpid=2282538019439588352#ancoraReviews';
var url_offer  = '/2345967';
var extraController = require('../../../controllers/extra.server.controller.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var ZanoxMerchant = require('../../../../config/merchants/zanox.merchant.js');


describe('Extra BR unit tests:',function(done){


	describe('Testing getContext function >>',function(done){

		var Context = {};
		var call = new requestUtile();

		before(function(done){

			this.timeout(20000);
			// remove double quotes
			var result_html = html.replace(/\”/g, "");
			call.getHtml(result_html,config.timeRequest,function(error,response,body){
				Context.body = body;
				done();
			});
		});


		it('Should return totalPaginacaoReviews > 1', function(done) {

			this.timeout(10000);
			
			extraController.getProductContext(Context.body,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.above(0);
				done();
			});
		});
	});


	describe('Testing setDataProducts function >>',function(done){

		var Context = {};

		before(function(){

			var timeRequest = 1000;
			Context.currentItem = 0;

			var offer = new Object ({
				name:'Batedeira Mondial Bella Massa B-23 com 4 Velocidades + Turbo, 2 Tigelas 4L e 2,3L - Preto',
	  			ean:7891129219410,
	  			category:"Batedeira",
	  			merchantProductId: 3480194,
	  			urlOffer:'/3480194',
	  			advertiser:"Extra BR",
			});

			Context.offer = offer;
		});

		it('Should add info to array products: totalPaginacaoReviews == 2', function(done) {
			this.timeout(15000);
			extraController.setDataProducts(Context.offer,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(2);
				done();
			});
		});
	});


	describe('Testing crawlerByProduct function >>',function(done){

		var Context = {};

		before(function(){

			var offer1 = new Object ({
				name:'Batedeira Mondial Bella Massa B-23 com 4 Velocidades + Turbo, 2 Tigelas 4L e 2,3L - Preto',
	  			ean:7898216299515,
	  			category:"Batedeira",
	  			merchantProductId: 3480194,
	  			urlOffer:'/3480194',
	  			advertiser:"Extra BR",
  				url:"http://ad.zanox.com/ppc/?27382580C63714936&ULP=[[/2345967?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletrodomesticos_Frost-Free&utm_content=2345967&cm_mmc=zanox_XML-_-ELDO-_-Comparador-_-2345967]]&zpar9=[[43EEF0445509C7205827]]"
			});

			var offer2 = new Object ({
				name:'Refrigerador Consul Cycle Defrost Duplex CRD36 com Super Freezer 334 L - Branco',
  				ean:7891356060731,
  				category:"Batedeira",
  				merchantProductId: 3085233,
  				urlOffer:'/3085233',
  				advertiser:"Extra BR",
  				url:"http://ad.zanox.com/ppc/?41259046C8758814&ULP=[[/3085233?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletroportateis_Batedeira&utm_content=3085233&cm_mmc=zanox_XML-_-ELPO-_-Comparador-_-3085233]]&zpar9=[[A3697E2455EA755B758F]]"
			});

			var arrayOffers = [];
			arrayOffers.push(offer1);
			arrayOffers.push(offer2);
			Context.arrayOffers = arrayOffers;
		});


		it('Should contReview == 14', function(done) {
			this.timeout(30000);
			var currentItem = 0;
			extraController.crawlerByProduct(currentItem,
										  Context.arrayOffers,
								 		  function(contReview){
								 		  	console.log("contReview >>",contReview);
								 		  	contReview.should.be.equal(14);
											done();
										  });
		});
	});


	describe('Testing getReviewsFromHtml function >>',function(done){

		var Context = {};

		before(function(done){
			
			this.timeout(10000);

			var timeRequest = 1000;
			Context.currentItem = 0;

			var offer = new Object ({
				name:'Batedeira Mondial Bella Massa B-23 com 4 Velocidades + Turbo, 2 Tigelas 4L e 2,3L - Preto',
	  			ean:7898216299515,
	  			category:"Batedeira",
	  			merchantProductId: 3480194,
	  			urlOffer:'/3480194',
	  			advertiser:"Extra BR",
  				url:"http://ad.zanox.com/ppc/?27382580C63714936&ULP=[[/2345967?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletrodomesticos_Frost-Free&utm_content=2345967&cm_mmc=zanox_XML-_-ELDO-_-Comparador-_-2345967]]&zpar9=[[43EEF0445509C7205827]]"
			});

			Context.offer = offer;

			var nameOffer = offer.name;
        	var idOffer = offer.merchantProductId;

			var urlToCrawler =  ZanoxMerchant.extra_url + nameOffer + '-' + idOffer + ".html";
       		// remove double quotes
        	var result_urlToCrawler = urlToCrawler.replace(/\"/g, "");
        	var result_urlToCrawler_2 = result_urlToCrawler.replace(/\+/g, "");
		
			var call = new requestUtile();

			call.getHtml(result_urlToCrawler_2,timeRequest,function(error,response,body){
				Context.data = body;
				done();
			});
		});

		it('Should contain the data below >>', function(done) {
			this.timeout(10000);
			extraController.getReviewsFromHtml(Context.data,
									  			Context.offer,
									  			function(arrayReviews){
									  				arrayReviews.should.containDeep([{author: 'Monteto'}]);
									  				arrayReviews.should.containDeep([{location: 'Minas gerais'}]);
									  				arrayReviews.should.containDeep([{date: '1442012400000'}]);
									  				arrayReviews.should.containDeep([{category: 'Batedeira'}]);
									  				arrayReviews.should.containDeep([{advertiser: 'Extra BR'}]);
									  				arrayReviews.should.containDeep([{ean: '7898216299515'}]);
									  				arrayReviews.should.containDeep([{rating: 4}]);
									  				arrayReviews.should.containDeep([{description:'Produto muito bom para refeições casuais'}]);
									  				arrayReviews.should.containDeep([{title:'Produto muito bom'}]);
													done();
									  			});
		});

	});


	after(function(){
		reviewController.deleteAllReviews(function(){
			console.log("bd clean");
			//mongoose.connection.close();
		});
	});

});