var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html = 'https://www.colombo.com.br/produto/Eletrodomesticos/Refrigerador-Geladeira-Electrolux-Cycle-Defrost-2-Portas-260-Litros-DC35A';
var url_offer  = '/produto/Eletrodomesticos/Refrigerador-Geladeira-Electrolux-Cycle-Defrost-2-Portas-260-Litros-DC35A';
var json_without_reviews = 'https://www.colombo.com.br/avaliacao-pagina?codProd=773808&pagina=1&ordemAvaliacao=1';
var json_with_reviews = 'https://www.colombo.com.br/avaliacao-pagina?codProd=212979&pagina=1&ordemAvaliacao=1';
var lcController = require('../../../controllers/lojas_colombo.server.controller.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var callPhantom = new phantomUtile();



describe('Lojas Colombo BR unit tests:',function(done){

		describe('Testing getContext function >>',function(done){

			var Context = {};

			before(function(done){

				this.timeout(50000);

				callPhantom.getHtml(html,config.timeRequest,function(body){
					Context.body = body;
					done();
				});
			});


			it('Should return productid = 226890 from product page html', function(done) {

				this.timeout(50000);
				
				lcController.getProductContext(Context.body,function(productid,totalPaginacaoReviews){
					productid.should.be.equal('226890');
					totalPaginacaoReviews.should.be.above(1);
					done();
				});
			});
		});


		describe('Testing setDataProducts function >>',function(done){

			var Context = {};

			before(function(){

				this.timeout(50000);

				var offer = new Object ({
					name:'Depurador de Ar Suggar Júpiter para Fogão de 4 Bocas, 60 cm',
		  			ean:7896518511793,
		  			category:"Eletrodomesticos / Depurador / Para Fogão 4 Bocas",
		  			merchantProductId: 760010,
		  			urlOffer:'/produto/Eletrodomesticos/Depurador-de-Ar-Suggar-Jupiter-para-Fogao-de-4-Bocas-60-cm',
		  			advertiser:"Lojas Colombo BR",
				});

				Context.offer = offer;
			});


			it('Should get >> productid==760010 and totalPaginacaoReviews === 1', function(done) {
				this.timeout(50000);
				lcController.setDataProducts(Context.offer,function(productid,totalPaginacaoReviews){
					productid.should.be.equal('760010');
					totalPaginacaoReviews.should.be.equal(1);
					done();
				});
			});
		});


		describe('Testing crawlerByProduct function >>',function(done){

			var Context = {};

			before(function(){

				this.timeout(50000);

				var Offer1 = new Object ({
					name:'Depurador de Ar Suggar Júpiter para Fogão de 4 Bocas, 60 cm',
		  			ean:7896518511793,
		  			category:"Eletrodomesticos / Depurador / Para Fogão 4 Bocas",
		  			merchantProductId: 760010,
		  			urlOffer:'/produto/Eletrodomesticos/Depurador-de-Ar-Suggar-Jupiter-para-Fogao-de-4-Bocas-60-cm',
		  			advertiser:"Lojas Colombo BR",
				});

				var Offer2 = new Object ({
					name:'Depurador de Ar Consul 60 cm para Fogão de 4 Bocas - CAT60GB',
		  			ean:7891129232501,
		  			category:"Eletrodomesticos / Depurador / Para Fogão 4 Bocas",
		  			merchantProductId: 756136,
		  			urlOffer:'/produto/Eletrodomesticos/Depurador-de-Ar-Consul-60-cm-para-Fogao-de-4-Bocas-CAT60GB',
		  			advertiser:"Lojas Colombo BR",
				});

				var arrayOffers = [];
				arrayOffers.push(Offer1);
				arrayOffers.push(Offer2);
				Context.arrayOffers = arrayOffers;
			});


			it('Should contReview == 0', function(done) {
				this.timeout(80000);
				var currentItem = 0;
				lcController.crawlerByProduct(	currentItem,
												Context.arrayOffers,
									 		  	function(contReview){
									 		  		contReview.should.be.equal(4);
													done();
											   	});
			});

		});


		describe('Testing getReviewsFromJson function >>',function(done){

			var Context = {};

			before(function(done){
				
				this.timeout(10000);

				var offer = new Object ({
					name:'Depurador de Ar Consul 60 cm para Fogão de 4 Bocas - CAT60GB',
		  			ean:7891129232501,
		  			category:"Eletrodomesticos / Depurador / Para Fogão 4 Bocas",
		  			merchantProductId: 756136,
		  			urlOffer:'/produto/Eletrodomesticos/Depurador-de-Ar-Consul-60-cm-para-Fogao-de-4-Bocas-CAT60GB',
		  			advertiser:"Lojas Colombo BR",
				});

				Context.offer = offer;

				var call = new requestUtile();

				call.getJson(json_with_reviews,config.timeRequest,function(data){
					Context.body = data;
					done();
				});
			});


			it('Should contain the data below >>', function(done) {
				this.timeout(2000);
				lcController.getReviewsFromJson(Context.body,
										  		Context.offer,
										  		function(arrayReviews){
										  			arrayReviews.should.containDeep([{author:'Jerri Adriano Ramos'}]);
									  				arrayReviews.should.containDeep([{location: ''}]);
									  				arrayReviews.should.containDeep([{date: '1357516800000'}]);
									  				arrayReviews.should.containDeep([{category: 'Eletrodomesticos / Depurador / Para Fogão 4 Bocas'}]);
									  				arrayReviews.should.containDeep([{advertiser: 'Lojas Colombo BR'}]);
									  				arrayReviews.should.containDeep([{ean: '7891129232501'}]);
									  				arrayReviews.should.containDeep([{rating: 5}]);
									  				arrayReviews.should.containDeep([{description:'Excelente produto. Recomendo para quem precisa de espaço.'}]);
									  				arrayReviews.should.containDeep([{title:'Avaliação'}]);
													done();
										  		});
			});
		});


		after(function(){
			reviewController.deleteAllReviews(function(){
				console.log("bd clean");
			});
		});

});	