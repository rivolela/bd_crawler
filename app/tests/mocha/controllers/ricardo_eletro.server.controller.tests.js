var reController = require('../../../controllers/ricardo_eletro.server.controller.js');
var request = require('request');
var should = require('should');
var host = "http://www.ricardoeletro.com.br";
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var uri = "/Produto/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169";
var config = require('../../../../config/config.js');
var url_offer = 'Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169';
var requestUtile = require('../../../utile/requests.server.utile.js');
var reviewController = require('../../../controllers/review.server.controller.js');


describe('Ricardo Eletro BR unit tests:',function(done){


	describe('Testing getProductId function >>',function(done){

		var Context = {};

		before(function(done){
			var url = host + uri;
			console.log(url);
			Context.url = url;
			done();
		});


		it('Should return productid = 85169 from product page html', function(done) {
			this.timeout(4000);
			reController.getProductId(Context.url,function(productid){
				productid.should.be.equal('85169');
				done();
			});
		});
	});


	describe('Testing getTotalPagination function >> ',function(done){

		it('Should return totalPaginacaoReviews = 2', function(done) {
			this.timeout(4000);
			var productid = 257082;
			reController.getTotalPagination(productid,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal('2');
				done();
			});
		});


		it('Should return totalPaginacaoReviews = 0', function(done) {
			this.timeout(4000);
			var productid = 999999;
			reController.getTotalPagination(productid,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(0);
				done();
			});
		});
	});


	describe('Testing setProductIdArrayProducts function >>',function(done){

		var Context = {};

		before(function(){
			var timeRequest = 1000;
			Context.currentItem = 0;

			var product1 = new Object ({
				name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
	  			ean:7896584063448,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 435595,
	  			urlOffer:url_offer,
	  			advertiser:"Ricardo Eletro BR",
			});

			var product2 = new Object ({
				name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
	  			ean:7896584063448,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 435595,
	  			urlOffer:url_offer,
	  			advertiser:"Ricardo Eletro BR",
			});

			var arrayProducts = [];
			arrayProducts.push(product1);
			arrayProducts.push(product2);
			Context.arrayProducts = arrayProducts;
		});


		it('Should add info to array products: productid==85169', function(done) {
			this.timeout(40000);
			reController.setProductIdArrayProducts(Context.currentItem,Context.arrayProducts,function(arrayProducts){
				arrayProducts[1].dataProductId.should.be.equal('85169');
				done();
			});
		});
	});


	describe('Testing setTotalPaginationArrayProducts function >>',function(done){

		var Context = {};

		before(function(){
			var timeRequest = 1000;
			Context.currentItem = 0;

			var product1 = new Object ({
				name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
	  			ean:7896584063448,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			dataProductId: 85169,
	  			advertiser:"Ricardo Eletro BR",
			});

			var product2 = new Object ({
				name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
	  			ean:7896584063448,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			dataProductId: 85169,
	  			advertiser:"Ricardo Eletro BR",
			});

			var arrayProducts = [];
			arrayProducts.push(product1);
			arrayProducts.push(product2);
			Context.arrayProducts = arrayProducts;
		});


		it('Should add info to array products: totalPaginacaoReviews > 1', function(done) {
			this.timeout(20000);
			reController.setTotalPaginationArrayProducts(Context.currentItem,Context.arrayProducts,function(arrayProducts){
				arrayProducts[1].totalPaginacaoReviews.should.be.above(20);
				done();
			});
		});
	});
	
	
	describe('Testing getReviewsFromHtml function >>',function(done){

		var Context = {};

		before(function(done){
			var timeRequest = 1000;
			Context.currentItem = 0;

			var product = new Object ({
				name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
	  			ean:7896584063448,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 435595,
	  			url:"http://www.ricardoeletro.com.br/Produto/Refrigerador-Geladeira-Electrolux-Infinity-Frost-Free-2-Portas-553-Litros-Inox-DF80X/256-270-274-5211/?utm_source=Zanox&prc=8803&utm_medium=CPC_Eletrodomesticos_Zanox&utm_campaign=Refrigerador&utm_content=Refrigerador_2_Portas&cda=E198-E863-BA87-DC80",
	  			advertiser:"Ricardo Eletro BR",
			});

			Context.product = product;

			call = new requestUtile();
			
			call.getHtml('http://www.ricardoeletro.com.br/Produto/Comentarios/5211/1',timeRequest,function(error,response,body){
				Context.body = body;
				done();
			});
		});


		it('Should return arrayReviews with 4 reviews', function(done) {
			reController.getReviewsFromHtml(Context.body,
											Context.product,
											function(arrayReviews){
												arrayReviews.length.should.be.equal(4);
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

