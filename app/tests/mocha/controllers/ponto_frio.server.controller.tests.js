var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html ='http://www.pontofrio.com.br/iPhone SE Apple com 16GB, Tela 4”, iOS 9, Sensor de Impressão Digital, Câmera iSight 12MP, Wi-Fi, 3G/4G, GPS, MP3, Bluetooth e NFC - Prateado-7990218.html';
var url_offer  = '/2345967';
var pfController = require('../../../controllers/ponto_frio.server.controller.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var ZanoxMerchant = require('../../../../config/merchants/zanox.merchant.js');


describe('Ponto Frio BR unit tests:',function(done){


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


		it('Should return totalPaginacaoReviews === 1', function(done) {

			this.timeout(10000);
			
			pfController.getProductContext(Context.body,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(1);
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
				name:'iPhone SE Apple com 16GB, Tela 4, iOS 9, Sensor de Impressão Digital, Câmera iSight 12MP, Wi-Fi, 3G/4G, GPS, MP3, Bluetooth e NFC - Prateado',
	  			ean:7891129219410,
	  			category:"smartphone",
	  			merchantProductId: 7990218,
	  			urlOffer:'/7990218',
	  			advertiser:"Pontofrio BR",
			});

			Context.offer = offer;
		});

		it('Should add info to array products: totalPaginacaoReviews === 1', function(done) {
			this.timeout(30000);
			pfController.setDataProducts(Context.offer,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(1);
				done();
			});
		});
	});


	describe('Testing crawlerByProduct function >>',function(done){

		var Context = {};

		before(function(){

			this.timeout(3000);

			var offer1 = new Object ({
				name:'iPhone SE Apple com 16GB, Tela 4, iOS 9, Sensor de Impressão Digital, Câmera iSight 12MP, Wi-Fi, 3G/4G, GPS, MP3, Bluetooth e NFC - Prateado',
	  			ean:7891129219410,
	  			category:"smartphone",
	  			merchantProductId: 7990218,
	  			urlOffer:'/7990218',
	  			advertiser:"Pontofrio BR",
			});

			var offer2 = new Object ({
				name:'Smartphone Samsung Galaxy J7 Prime Duos Dourado com 32GB Tela 5 5 Dual Chip 4G Camera 13MP Leitor Biometrico Android 6 0 e Processador OctaCore',
	  			ean:7891129219412,
	  			category:"smartphone",
	  			merchantProductId: 10476497,
	  			urlOffer:'/10476497',
	  			advertiser:"Pontofrio BR",
			});

			var arrayOffers = [];
			arrayOffers.push(offer1);
			arrayOffers.push(offer2);
			Context.arrayOffers = arrayOffers;
		});


		it('Should contReview == 16', function(done) {
			this.timeout(70000);
			var currentItem = 0;
			pfController.crawlerByProduct(currentItem,
										  Context.arrayOffers,
								 		  function(contReview){
								 		  	console.log("contReview >>",contReview);
								 		  	contReview.should.be.equal(16);
											done();
										  });
		});
	});


	describe('Testing getReviewsFromHtml function >>',function(done){

		var Context = {};

		before(function(done){
			
			this.timeout(60000);

			var timeRequest = 1000;
			Context.currentItem = 0;

			var offer = new Object ({
				name:'Smartphone Samsung Galaxy J7 Prime Duos Dourado com 32GB Tela 5 5 Dual Chip 4G Camera 13MP Leitor Biometrico Android 6 0 e Processador OctaCore',
	  			ean:7891129219412,
	  			category:"smartphone",
	  			merchantProductId: 10476497,
	  			urlOffer:'/10476497',
	  			advertiser:"Pontofrio BR",
			});

			Context.offer = offer;

			var nameOffer = offer.name;
        	var idOffer = offer.merchantProductId;

        	var urlToCrawler =  ZanoxMerchant.ponto_frio_url + nameOffer + '-' + idOffer + ".html";
        	// remove double quotes
        	var result_urlToCrawler = urlToCrawler.replace(/\"/g, "");
        	var result_urlToCrawler_2 = result_urlToCrawler.replace(/\+/g, "");
        	console.log("result_urlToCrawler_2",result_urlToCrawler_2);

			var call = new requestUtile();

			call.getHtml(result_urlToCrawler_2,timeRequest,function(error,response,body){
				Context.data = body;
				done();
			});
		});


		it('Should return arrayReviews === 10 ', function(done) {
			this.timeout(10000);
			pfController.getReviewsFromHtml(Context.data,
									  		Context.offer,
									  		function(arrayReviews){
									  			arrayReviews.length.should.be.equal(10);
									  			console.log(arrayReviews);
												done();
									  		});
		});


		it('Should contain the data below >>', function(done) {
			this.timeout(10000);
			pfController.getReviewsFromHtml(Context.data,
									  		Context.offer,
									  		function(arrayReviews){
									  			arrayReviews.should.containDeep([{author: 'Bruna'}]);
								  				arrayReviews.should.containDeep([{location: 'São paulo'}]);
								  				arrayReviews.should.containDeep([{date: '1490569200000'}]);
								  				arrayReviews.should.containDeep([{category: 'smartphone'}]);
								  				arrayReviews.should.containDeep([{advertiser: 'Pontofrio BR'}]);
								  				arrayReviews.should.containDeep([{ean: '7891129219412'}]);
								  				arrayReviews.should.containDeep([{rating: 5}]);
								  				arrayReviews.should.containDeep([{description:'Superou minhas expectativas. Camera muito boa, e a bateria também. Super recomendo.'}]);
								  				arrayReviews.should.containDeep([{title:'Adorei'}]);
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