var request = require('request');
var should = require('should');
var StringUtile = require('../../../utile/string.server.utile.js');
var assert = require("assert");
var config = require('../../../../config/config.js');


describe('String Utile Server Tests >> ',function(){

	it('Should remove accents',function(done){

		this.timeout(2000);

		var word = "café ação";

		var result = word.removerAcento();

		result.should.be.equal('cafe acao');

		done();

	});

});