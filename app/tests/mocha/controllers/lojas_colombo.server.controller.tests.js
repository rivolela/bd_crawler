var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html = 'http://localhost:3000/lojas_colombo.html';
var json_without_reviews = 'https://www.colombo.com.br/avaliacao-pagina?codProd=773808&pagina=1&ordemAvaliacao=1';
var json_with_reviews = 'https://www.colombo.com.br/avaliacao-pagina?codProd=212979&pagina=1&ordemAvaliacao=1';
var lcController = require('../../../controllers/lojas_colombo.server.controller.js');

describe('Lojas Colombo BR unit tests:',function(done){

		describe('Testing getContext function >>',function(done){

			var Context = {};
			var call = new requestUtile();

			before(function(done){

				this.timeout(10000);

				call.getHtml(html,config.timeRequest,function(error,response,body){
					Context.body = body;
					//console.log(body);
					done();
				});
			});


			it('Should return productid = 212979 from product page html', function(done) {

				this.timeout(10000);
				
				lcController.getProductContext(Context.body,function(productid,totalPaginacaoReviews){
					productid.should.be.equal('212979');
					totalPaginacaoReviews.should.be.above(1);
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
					name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
		  			ean:7896584063448,
		  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
		  			merchantProductId: 435595,
		  			url:html,
		  			advertiser:"Lojas Colombo BR",
				});

				var product2 = new Object ({
					name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
		  			ean:7896584063448,
		  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
		  			merchantProductId: 435595,
		  			url:html,
		  			advertiser:"Lojas Colombo BR",
				});

				var arrayProducts = [];
				arrayProducts.push(product1);
				arrayProducts.push(product2);
				Context.arrayProducts = arrayProducts;
			});


			it('Should add info to array products: productid==212979 and totalPaginacaoReviews > 1', function(done) {
				this.timeout(10000);
				lcController.setDataProducts(Context.currentItem,Context.arrayProducts,function(arrayProducts){
					//console.log("arrayProducts",arrayProducts);
					arrayProducts[1].dataProductId.should.be.equal('212979');
					arrayProducts[1].totalPaginacaoReviews.should.be.above(1);
					done();
				});
			});
		});


		describe('Testing crawlerByProduct function >>',function(done){

			var Context = {};

			before(function(){

				var product1 = new Object ({
					name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
		  			ean:7896584063448,
		  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
		  			merchantProductId: 435595,
		  			url:json_without_reviews,
		  			advertiser:"Lojas Colombo BR",
		  			totalPaginacaoReviews:0,
		  			dataProductId:773808
				});

				var product2 = new Object ({
					name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
		  			ean:7896584063448,
		  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
		  			merchantProductId: 435595,
		  			url:json_with_reviews,
		  			advertiser:"Lojas Colombo BR",
		  			totalPaginacaoReviews:1,
		  			dataProductId:212979
				});

				var arrayProducts = [];
				arrayProducts.push(product1);
				arrayProducts.push(product2);
				Context.arrayProducts = arrayProducts;
			});


			it('Should contReview == 0', function(done) {
				this.timeout(10000);
				var currentItem = 0;
				lcController.crawlerByProduct(currentItem,Context.arrayProducts[0],
									 		  function(contReview){
									 		  		contReview.should.be.equal(0);
													done();
											   });
			});


			it('Should contReview > 0', function(done) {
				this.timeout(10000);
				var currentItem = 1;
				lcController.crawlerByProduct(currentItem,Context.arrayProducts,
									 		  function(contReview){
									 		  		contReview.should.be.above(0);
													done();
											   });
			});
			
		});



		describe('Testing getJson function >>',function(done){
			
			var productid = '212979';
			var pagination = 1;

			it('Should arrayReviews to be of type json and have the attributes:ordemSelecionadaAvaliacao, avaliacoesPagina and paginacao', function(done) {
				this.timeout(10000);
				lcController.getJson(productid,
									pagination,
								 	function(arrayReviews){
										arrayReviews.should.be.json; // jshint ignore:line
										arrayReviews.should.have.keys('ordemSelecionadaAvaliacao','avaliacoesPagina','paginacao');
										done();
									});
			});
			
		});



		describe('Testing getReviewsFromJson function >>',function(done){

			var Context = {};

			before(function(done){
				
				this.timeout(10000);

				var timeRequest = 1000;
				Context.currentItem = 0;

				var product = new Object ({
					name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
		  			ean:7896584063448,
		  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
		  			merchantProductId: 435595,
		  			url:html,
		  			manufacturer:'Electrolux',
		  			advertiser:"Lojas Colombo BR",
				});

				Context.product = product;

				var call = new requestUtile();

				call.getJson(json_with_reviews,timeRequest,function(data){
					Context.data = data;
					done();
				});
			});


			it('Should return arrayReviews > 9 ', function(done) {
				this.timeout(10000);
				lcController.getReviewsFromJson(Context.data,
										  		Context.product,
										  		function(arrayReviews){
										  			arrayReviews.length.should.be.above(9);
													done();
										  		});
			});


			it('Should contain the author:Willian Andrade Garcia in arrayReviews', function(done) {
				this.timeout(10000);
				lcController.getReviewsFromJson(Context.data,
										  		Context.product,
										  		function(arrayReviews){
										  			arrayReviews.should.containDeep([{author: 'Thais Lessa'}]);
													done();
										  		});
			});

		});

});	