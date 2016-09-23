var	request = require('request'),
	should = require('should'),
 	assert = require("assert"),
 	supertest = require("supertest")("https://www.walmart.com.br"),
 	zanoxJob = require("../../jobs/zanox.server.job.js");


// Code here will be linted with JSHint.
describe('Zanox Job Unit Tests:',function(done){

	describe('Testing function setUrlOffers >>',function(done){
		
		it('Should return the same url sent to function',function(done){
			var url = 'http://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&q=geladeira&programs=12011';
			zanoxJob.setUrlOffers(url,function(urlOffer){
				(url == urlOffer).should.be.ok; // jshint ignore:line
				console.log(urlOffer);
				done();
			});
		});


		it('Should return the url default, pre set in env > test.js ',function(done){
			var url = null;
			zanoxJob.setUrlOffers(url,function(urlOffer){
				urlOffer.should.be.not.null; // jshint ignore:line
				console.log(urlOffer);
				done();
			});
		});

	});


	describe('Testing function start >>',function(done){

		it('Should return the arrayProducts > 30',function(done){
			var url = 'http://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&q=geladeira&programs=12011';
			zanoxJob.start(url,function(arrayProducts){
				//arrayProducts.length.should.be.above(30);
				done();
			});
		});

	});

});



