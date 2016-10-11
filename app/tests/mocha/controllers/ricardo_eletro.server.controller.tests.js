var reController = require('../../../controllers/ricardo_eletro.server.controller.js');
var request = require('request');
var should = require('should');
var host = "http://www.ricardoeletro.com.br";
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var uri = "/Produto/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169";
var config = require('../../../../config/config.js');
var html = 'http://localhost:3000/ricardo_eletro.html';
var requestUtile = require('../../../utile/requests.server.utile.js');

describe('Ricardo Eletro BR unit tests:',function(done){

	var Context = {};
	var call = new requestUtile();

	

	describe('Testing getContext function >>',function(done){

		before(function(done){
			var url = host + uri;
			console.log(url);
			var timeRequest = 0000;

			call.getHtml(html,timeRequest,function(error,response,body){
				Context.body = body;
				console.log(body);
				done();
			});
		});


		it('Should return productid = 85169 from product page html', function(done) {
			this.timeout(1000);
			reController.getProductContext(Context.body,function(productid,totalPaginacaoReviews){
				productid.should.be.equal('85169');
				totalPaginacaoReviews.should.be.above(20);
				done();
			});
		});
	});


	describe('Testing setDataProducts function >>',function(done){

		before(function(){
			var timeRequest = 1000;
			Context.currentItem = 0;

			var product1 = new Object ({
				name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
	  			ean:7896584063448,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 435595,
	  			url:html,
	  			advertiser:"Ricardo Eletro BR",
			});

			var product2 = new Object ({
				name:'Refrigerador | Geladeira Cycle Defrost Duas Portas Inox 475L - DC51X - Electrolux',
	  			ean:7896584063448,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 435595,
	  			url:html,
	  			advertiser:"Ricardo Eletro BR",
			});

			var arrayProducts = [];
			arrayProducts.push(product1);
			arrayProducts.push(product2);
			Context.arrayProducts = arrayProducts;
		});


		it('Should add info to array products: productid and totalPaginacaoReviews', function(done) {
			this.timeout(2000);
			reController.setDataProducts(Context.currentItem,Context.arrayProducts,function(arrayProducts){
				console.log("arrayProducts",arrayProducts);
				arrayProducts[1].dataProductId.should.be.equal('85169');
				arrayProducts[1].totalPaginacaoReviews.should.be.above(20);
				done();
			});
		});
	});

	
	describe('Testing getReviewsFromHtml function >>',function(done){

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

			call.getHtml('http://localhost:3000/ricardo_eletro_review.html',timeRequest,function(error,response,body){
				Context.body = body;
				done();
			});
		});


		it('Should return arrayProductsWalmart[1], for pagination 0, with 4 reviews', function(done) {
			reController.getReviewsFromHtml(Context.body,
											Context.product,
											function(arrayReviews){
												arrayReviews.length.should.be.equal(4);
												done();
											});
		});

	});

});

