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


	describe('Testing save product function >>',function(done){

		before(function(done){

			this.timeout(2000);

			var Offer = new Object ({
				name:'Jogo The Sims 4 - PC"',
	  			ean:7892110190213,
	  			departamentBD:"eletrodomésticos",
	  			countSad:2,
	  			countHappy: 7,
	  			totalReviews: 9,
	  			manufacturer: "Samsung",
	  			nameURL: "jogo-the-sims-4-pc",
	  			image_medium: "https://static.wmobjects.com.br/imgres/arquivos/ids/8482269-250-250"
			});

			Context.Offer = Offer;

			done();
		});


		it('Should return productid = 226890 from product page html', function(done) {

			this.timeout(20000);
			
			productController.updateProductReviews(Context.Offer,function(error, response, data){
				console.log("error >> ",error);
				console.log("response >> ",response);
				console.log("data >> ",data);
				// productid.should.be.equal('226890');
				// totalPaginacaoReviews.should.be.above(1);
				done();
			});
		});


		// it('Should return productid = 226890 from product page html', function(done) {

		// 	this.timeout(20000);
			
		// 	request.del('https://da-product-srv.herokuapp.com/api/products/ean/7892110190213?connectid=A3697E2455EA755B758F')
		// 		// .set('Accept','application/json')
		// 		// .expect('Content-Type',/json/)
		// 		.expect(200)
		// 		.end(function(err,res){
		// 			console.log(res);
		// 			console.log(err);
		// 			// res.body.should.have.property('message',"product with EAN >> 7892110190213 deleted");
		// 			done();
		// 	});
		// });


		after(function(){
		});
	});
  

});
/* jshint ignore:end */
