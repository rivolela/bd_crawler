var request = require('request');
var should = require('should');
var RequestsUtile = require('../utile/requests.server.utile.js');
var assert = require("assert");
var supertest = require("supertest")("https://www.walmart.com.br");

//var urlHtml = "https://www.walmart.com.br/item/1230534/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2206732065930961920&utm_term=httpwwwskimlinkscom";
var urlJson = 'http://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&q=fogao+brastemp&programs=12011';
var urlHtml = "http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[34303/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]";

describe('Requests Utile Server Tests:',function(){

	it('Should return status code 200 from getJson',function(done){
		var call = new RequestsUtile();
		call.getJson(urlJson,function(error,response,body){
			should(response.statusCode).equal(200);
			done();
		});
	});


	it('Should return status code 200 from getHtml',function(done){
		var call = new RequestsUtile();
		var timeRequest = 0;

		call.getHtml(urlHtml,timeRequest,function(error,response,body){	
			console.log("body >>",body);
	  		console.log('\n');
	  		console.log("error >>",error);
	  		console.log('\n');
	  		console.log("response statusCode >>",response.statusCode);
	  		console.log('\n');		
			should(response.statusCode).equal(200);
			done();
		});
	});

});
	
