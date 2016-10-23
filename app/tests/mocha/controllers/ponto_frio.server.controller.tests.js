var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html = 'http://localhost:3000/ponto_frio.html';
var url_offer  = 'ponto_frio.html';
var lcController = require('../../../controllers/ponto_frio.server.controller.js');


describe('Ponto Frio BR unit tests:',function(done){


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

}