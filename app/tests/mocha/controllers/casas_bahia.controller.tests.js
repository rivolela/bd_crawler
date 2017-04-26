var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html ="http://www.casasbahia.com.br/iPad Air 2 Apple com Tela Retina de 9,7'', Wi-Fi, 3G/4G, Touch ID, Bluetooth, Câmera iSight 8MP e iOS 8 - Prateado-4305019.html";
var url_offer  = '/2345967';
var novaController = require('../../../controllers/nova_ponto_com.server.controller.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var ZanoxMerchant = require('../../../../config/merchants/zanox.merchant.js');


describe('Casas Bahia BR unit tests:',function(done){


	describe('Testing getContext function >>',function(done){

		var Context = {};
		var call = new requestUtile();

		before(function(done){

			this.timeout(80000);
			// remove double quotes
			var result_html = html.replace(/\”/g, "");
			// remove single quotes
			var result_html_2 = result_html.replace(/\'/g, "");
			call.getHtml(result_html_2,config.timeRequest,function(error,response,body){
				Context.body = body;
				done();
			});
		});


		it('Should return totalPaginacaoReviews === 1', function(done) {

			this.timeout(2000);
			
			novaController.getProductContext(Context.body,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(1);
				done();
			});
		});
	});


	describe('Testing setDataProducts function >>',function(done){

		var Context = {};

		before(function(){

			this.timeout(1000);

			var timeRequest = 1000;
			Context.currentItem = 0;

			var offer = new Object ({
				name:'iPad Air 2 Apple com Tela Retina de 9,7, Wi-Fi, 3G/4G, Touch ID, Bluetooth, Câmera iSight 8MP e iOS 8 - Prateado',
	  			ean:9999999999,
	  			category:"Ipad",
	  			merchantProductId: 4305019,
	  			urlOffer:'4305019',
	  			advertiser:"Casas Bahia BR"
			});

			Context.offer = offer;
		});

		it('Should add info to array products: totalPaginacaoReviews == 1', function(done) {
			this.timeout(20000);
			novaController.setDataProducts(Context.offer,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(1);
				done();
			});
		});
	});


	describe('Testing crawlerByProduct function >>',function(done){

		var Context = {};

		before(function(){

			var offer = new Object ({
				name:'iPad Air 2 Apple com Tela Retina de 9,7, Wi-Fi, 3G/4G, Touch ID, Bluetooth, Câmera iSight 8MP e iOS 8 - Prateado',
	  			ean:9999999999,
	  			category:"Ipad",
	  			merchantProductId: 4305019,
	  			urlOffer:'4305019',
	  			advertiser:"Casas Bahia BR"
			});

			var arrayOffers = [];
			arrayOffers.push(offer);
			Context.arrayOffers = arrayOffers;
		});


		it('Should contReview == 3', function(done) {
			this.timeout(10000);
			var currentItem = 0;
			novaController.crawlerByProduct(currentItem,
										  Context.arrayOffers,
								 		  function(contReview){
								 		  	console.log("contReview >>",contReview);
								 		  	contReview.should.be.equal(3);
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
				name:'iPad Air 2 Apple com Tela Retina de 9,7, Wi-Fi, 3G/4G, Touch ID, Bluetooth, Câmera iSight 8MP e iOS 8 - Prateado',
	  			ean:9999999999,
	  			category:"Ipad",
	  			merchantProductId: 4305019,
	  			urlOffer:'4305019',
	  			advertiser:"Casas Bahia BR"
			});

			Context.offer = offer;

			var nameOffer = offer.name;
        	var idOffer = offer.merchantProductId;

			var urlToCrawler =  ZanoxMerchant.casas_bahia_url + nameOffer + '-' + idOffer + ".html";
       		// remove double quotes
			var result_html = urlToCrawler.replace(/\”/g, "");
			// remove single quotes
			var result_html_2 = result_html.replace(/\'/g, "");
		
			var call = new requestUtile();

			call.getHtml(result_html_2,timeRequest,function(error,response,body){
				Context.data = body;
				done();
			});
		});

		it('Should contain the data below >>', function(done) {
			this.timeout(10000);
			novaController.getReviewsFromHtml(Context.data,
									  			Context.offer,
									  			function(arrayReviews){
									  				arrayReviews.should.containDeep([{author: 'JOSÉ'}]);
									  				arrayReviews.should.containDeep([{location: 'JOÃO PESSOA'}]);
									  				arrayReviews.should.containDeep([{date: '1484524800000'}]);
									  				arrayReviews.should.containDeep([{category: 'Ipad'}]);
									  				arrayReviews.should.containDeep([{advertiser: 'Casas Bahia BR'}]);
									  				arrayReviews.should.containDeep([{ean: '9999999999'}]);
									  				arrayReviews.should.containDeep([{rating: 5}]);
									  				arrayReviews.should.containDeep([{description:'NÃO RECEBI O PRODUTO APESAR DE JÁ TER PAGO A PRIMEIRA PARCELA.'}]);
									  				arrayReviews.should.containDeep([{title:'NÃO RECEBI O PRODUTO'}]);
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