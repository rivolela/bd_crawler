var request = require('request');
var should = require('should');
var requestsUtile = require('../../../utile/requests.server.utile.js');
var zanox = require('../../../controllers/zanox.server.controller.js');
var Offer = require('../../../controllers/offer.server.controller.js');
var config = require('../../../../config/config.js');
var assert = require("assert");

var supertest = require("supertest")("https://www.walmart.com.br");

var apiZanox = "http://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&q=fogao+brastemp&programs=12011";

// var host = 'api.zanox.com/json/2011-03-01/';
// var uri = 'products';
// var connectid = 'connectid=43EEF0445509C7205827';
// var programs = 'programs=12011';
// var query = 'q=geladeira%20brastemp';
// var category = 'merchantcategory=Eletrodomésticos / Fogões / Fogão 4 bocas';
// var items = 'items=50';
// var url = 'https://' + host + uri + '?' + connectid + '&' + programs + '&' + query + '&' + category + '&' + items ;


// Code here will be linted with JSHint.
/* jshint ignore:start */
describe('Zanox Unit Tests:',function(done){

	//var offer = new Offer();
	var currentPage = 0;
	var currentItem = 0;

	var Context = {};
  
	describe('Testing connection api zanox >>',function(){
		it('Should return items == 10',function(done){
			//this.timeout(6000);
			var call = new requestsUtile();
			var timeRequest = 0;
			call.getJson(apiZanox,timeRequest,function(data,response){
				data.items.should.be.equal(10);
				done();
			});
		});
	});


	describe('Testing context about the searched offers >>',function(){
		it('Should return totalItems > 0',function(done){
			this.timeout(4000);
			var itemsByPage = 50;
			zanox.getOffersContext(apiZanox,itemsByPage,function(totalPaginacao,totalItems,itemsByPage){
				totalItems.should.be.above(0);
				done();
			});
		});
	});


	describe('Testing pagination >>',function(){
		it('Should return array Pagination == 10',function(done){
			this.timeout(2000);
			var totalPagination = 10;
			var paginationArray = [];
			zanox.getPagination(currentPage,totalPagination,paginationArray,function(paginationArray){
				paginationArray.should.have.lengthOf(10);
				done();
			});
		});


		it('Should return array Pagination == 0',function(done){
			this.timeout(4000);
			var totalPagination = 0;
			var paginationArray = [];
			zanox.getPagination(currentPage,totalPagination,paginationArray,function(paginationArray){
				paginationArray.should.have.lengthOf(0);
				done();
			});
		});


		it('Should return total items by pagination {0} > 10',function(done){
			this.timeout(4000);
			var currentPage = 0;
			var totalPagination = 1;
			var paginationArray = [];
			var pagination = new Object();
			
			pagination.url = "https://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&programs=12011&q=geladeira%20brastemp&merchantcategory=Eletrodomésticos / Fogões / Fogão 4 bocas&items=50&page=0";
			paginationArray.push(pagination);

			zanox.getItemsByPagination(currentPage,paginationArray,function(paginationArray){
				paginationArray[0].items.should.be.above(10);
				done();
			});
				
		});
	});


	describe('Testing get offers >>',function(){
		it('Should return array of products > 10 from pagination {0}',function(done){
			this.timeout(6000);
			var currentPage = 0;
			var currentItem = 0;
			var paginationArray = [];
			var productsArray = [];

			var pagination = new Object();
			pagination.url = "https://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&programs=12011&q=geladeira%20brastemp&merchantcategory=Eletrodomésticos / Fogões / Fogão 4 bocas&items=50&page=0";
			pagination.items = 10;
			paginationArray.push(pagination);

			zanox.getProductsByPagination(currentPage,paginationArray,productsArray,function(productsArray){
				productsArray.length.should.be.above(10);
				done();
			});
		});
	});

});
// Code here will be ignored by JSHint.
/* jshint ignore:end */


