var config = require('../../../../config/config.js');
var app = require('../../../../server.js');
var mongoose = require('mongoose');
var request = require('supertest');
var should = require('should');
var requestsUtile = require('../../../utile/requests.server.utile.js');
var productController = require('../../../controllers/product.server.controller.js');
var assert = require("assert");
var supertest = require("supertest")("https://www.walmart.com.br");
var apiZanox = "http://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&q=fogao+brastemp&programs=12011";


/* jshint ignore:start */
describe('Product Unit Tests >>',function(done){

	var currentPage = 0;
	var currentItem = 0;
	var Context = {};


	describe('Testing products function >>',function(done){

		before(function(done){

			this.timeout(2000);

			var Product = new Object ({
				name:'Jogo The Sims 4 - PC"',
	  			ean:91919191919911,
	  			departamentBD:"games",
	  			countSad:2,
	  			countHappy: 7,
	  			totalReviews: 9,
	  			manufacturer: "Samsung",
	  			nameURL: "jogo-the-sims-4-pc",
	  			image: "https://static.wmobjects.com.br/imgres/arquivos/ids/8482269-250-250"
			});
			Context.Product = Product;
			done();
		});


		it('Should be ablet to create a new product >>', function(done) {
			this.timeout(50000);
			productController.createProduct(Context.Product,function(error, response, body){
				console.log(body);
				body.countSad.should.be.equal(2);
				body.countHappy.should.be.equal(7);
				body.totalReviews.should.be.equal(9);
				done();
			});
		});


		it('Should be able to update product properties (countSad,countHappy and totalReviews) >>', function(done) {
			this.timeout(50000);
			var countSad = 2;
			var countHappy = 2;
			var totalReviews = 4;
			productController.updateProduct(Context.Product,countSad,countHappy,totalReviews,function(error, response, data){
				console.log(data);
				data.should.have.property('countSad',2);
				data.should.have.property('countHappy',2);
				data.should.have.property('totalReviews',4);
				data.should.have.property('image','https://static.wmobjects.com.br/imgres/arquivos/ids/8482269-250-250');
				done();
			});
		});


		// it('Should return productid = 226890 from product page html', function(done) {
		// 	this.timeout(50000);
		// 	productController.updateProductReviews(Context.Product,function(error, response, data){
		// 		console.log("error >> ",error);
		// 		console.log("response >> ",response);
		// 		console.log("data >> ",data);
		// 		// productid.should.be.equal('226890');
		// 		// totalPaginacaoReviews.should.be.above(1);
		// 		done();
		// 	});
		// });


		it('Should be able to delete product with EAN === 91919191919911', function(done) {
			this.timeout(20000);
			productController.deleteProductByEAN(Context.Product,function(error, response, body){
				body.message.should.be.equal('product with EAN >> 91919191919911 deleted');
				done();
			});
		});

	});
  

});
/* jshint ignore:end */
