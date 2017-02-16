var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html ='http://www.pontofrio.com.br/iPhone SE Apple com 16GB, Tela 4”, iOS 9, Sensor de Impressão Digital, Câmera iSight 12MP, Wi-Fi, 3G/4G, GPS, MP3, Bluetooth e NFC - Prateado-7990218.html';
var url_offer  = '/2345967';
var pfController = require('../../../controllers/ponto_frio.server.controller.js');
var reviewController = require('../../../controllers/review.server.controller.js');


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


		it('Should return totalPaginacaoReviews > 1', function(done) {

			this.timeout(10000);
			
			pfController.getProductContext(Context.body,function(totalPaginacaoReviews){
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

			var product1 = new Object ({
				name:'Refrigerador Consul Cycle Defrost Duplex CRD36 com Super Freezer 334 L - Branco',
	  			ean:7891129219410,
	  			category:"2 Portas",
	  			merchantProductId: 3384236,
	  			urlOffer:'/3384236',
	  			advertiser:"Pontofrio BR",
			});

			var product2 = new Object ({
				name:'Refrigerador Consul Cycle Defrost Duplex CRD36 com Super Freezer 334 L - Branco',
	  			ean:7891129219410,
	  			category:"2 Portas",
	  			merchantProductId: 3384236,
	  			urlOffer:'/3384236',
	  			advertiser:"Pontofrio BR",
			});

			var arrayProducts = [];
			arrayProducts.push(product1);
			arrayProducts.push(product2);
			Context.arrayProducts = arrayProducts;
		});

		it('Should add info to array products: totalPaginacaoReviews > 10', function(done) {
			this.timeout(20000);
			pfController.setDataProducts(Context.currentItem,Context.arrayProducts,function(arrayProducts){
				arrayProducts[0].totalPaginacaoReviews.should.be.above(10);
				arrayProducts[1].totalPaginacaoReviews.should.be.above(10);
				done();
			});
		});
	});


	describe('Testing crawlerByProduct function >>',function(done){

		var Context = {};

		before(function(){

			var product1 = new Object ({
				name:'Refrigerador Consul Cycle Defrost Duplex CRD36 com Super Freezer 334 L - Branco',
  				ean:7891129219410,
  				category:"2 Portas",
  				merchantProductId: 3384236,
  				urlOffer:'/3384236',
  				totalPaginacaoReviews:12,
  				advertiser:"Pontofrio BR",
  				url:"http://ad.zanox.com/ppc/?27382580C63714936&ULP=[[/2345967?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletrodomesticos_Frost-Free&utm_content=2345967&cm_mmc=zanox_XML-_-ELDO-_-Comparador-_-2345967]]&zpar9=[[43EEF0445509C7205827]]"
			});

			var product2 = new Object ({
				name:'Refrigerador Consul Cycle Defrost Duplex CRD36 com Super Freezer 334 L - Branco',
  				ean:7891129219410,
  				category:"2 Portas",
  				merchantProductId: 3384236,
  				urlOffer:'/3384236',
  				totalPaginacaoReviews:12,
  				advertiser:"Pontofrio BR",
  				url:"http://ad.zanox.com/ppc/?27382580C63714936&ULP=[[/2345967?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletrodomesticos_Frost-Free&utm_content=2345967&cm_mmc=zanox_XML-_-ELDO-_-Comparador-_-2345967]]&zpar9=[[43EEF0445509C7205827]]"
			});

			var arrayProducts = [];
			arrayProducts.push(product1);
			arrayProducts.push(product2);
			Context.arrayProducts = arrayProducts;
		});


		it('Should contReview == 10', function(done) {
			this.timeout(20000);
			var currentItem = 1;
			pfController.crawlerByProduct(currentItem,
										  Context.arrayProducts,
								 		  function(contReview){
								 		  	console.log("contReview >>",contReview);
								 		  	contReview.should.be.equal(10);
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

			var product = new Object ({
				name:'Refrigerador Consul Cycle Defrost Duplex CRD36 com Super Freezer 334 L - Branco',
				ean:7891129219410,
				category:"2 Portas",
				merchantProductId: 3384236,
				urlOffer:'/3384236',
				totalPaginacaoReviews:12,
				advertiser:"Pontofrio BR",
				url:"http://ad.zanox.com/ppc/?27382580C63714936&ULP=[[/2345967?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletrodomesticos_Frost-Free&utm_content=2345967&cm_mmc=zanox_XML-_-ELDO-_-Comparador-_-2345967]]&zpar9=[[43EEF0445509C7205827]]"
			});

			var departament = "Eletrodomesticos/";

			var urlToCrawler = 	config.ponto_frio_url + 
    							departament + 
    							product.category + "/" +
    							product.name + 
    							product.urlOffer + ".html";

			Context.product = product;

			var call = new requestUtile();

			call.getHtml(urlToCrawler,timeRequest,function(error,response,body){
				Context.data = body;
				done();
			});
		});


		it('Should return arrayReviews equal 10 ', function(done) {
			this.timeout(10000);
			pfController.getReviewsFromHtml(Context.data,
									  		Context.product,
									  		function(arrayReviews){
									  			arrayReviews.length.should.be.equal(10);
												done();
									  		});
		});


		it('Should contain the author: ander in arrayReviews', function(done) {
			this.timeout(10000);
			pfController.getReviewsFromHtml(Context.data,
									  		Context.product,
									  		function(arrayReviews){
									  			arrayReviews.should.containDeep([{author: 'Augusto'}]);
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