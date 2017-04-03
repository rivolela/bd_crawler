var mongoose = require('mongoose');
var ReviewSchema = require('../../../models/review.server.model');
var Review = mongoose.model( 'Review', ReviewSchema);
var config = require('../../../../config/config.js');
var request = require('request');
var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var assert = require("assert");
var walmart = require('../../../controllers/walmart.server.controller.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var supertest = require("supertest")("https://www.walmart.com.br");
var testeUrl = "https://www.walmart.com.br/item/1230534/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2206732065930961920&utm_term=httpwwwskimlinkscom";
var uri = "/item/1230534/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2206732065930961920&utm_term=httpwwwskimlinkscom";



// Code here will be linted with JSHint.
/* jshint ignore:start */
describe('Walmart Advertiser Server Tests:',function(done){

	var Context = {};
	var call = new requestUtile();
	var timeRequest = 1000;

	before(function(done){

			this.timeout(10000);

			var offer1 = new Object ({
				name:'Fogao de Embutir 5 Bocas Brastemp Clean BYS5TAR Inox com Timer',
	  			ean:77777777777777,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 1109777,
	  			url:"https://www.walmart.com.br/item/35172/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2224545894140288000&utm_term=httpwwwskimlinkscom",
	  			urlOffer:'35172/sk',
	  			advertiser:"walmart",
	  			totalReviewsPage :4,
          		totalPaginacaoReviews: 1
			});

			var offer2 = new Object ({
				name:'Freezer/Refrigerador Vertical Brastemp Flex 228 Litros Frost Free BVR28HR Inox',
	  			ean:88888888888888,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 1109777,
	  			url:"https://www.walmart.com.br/item/35172/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2224545894140288000&utm_term=httpwwwskimlinkscom",
	  			urlOffer:'35172/sk',
	  			advertiser:"walmart",
	  			totalReviewsPage :8,
          		totalPaginacaoReviews: 1
			});

			var arrayOffers = [];
			arrayOffers.push(offer1);
			arrayOffers.push(offer2);

			Context.currentItem = 0; 
			Context.arrayOffers = arrayOffers;
			Context.currentPaginationReview = 0;

			call.getHtml(Context.arrayOffers[1].url,timeRequest,function(error,response,body){
				Context.body = body;
				done();
			});
	});


	describe('Testing requests to Walmart >>',function(done){

		it('Should return 200 to call walmart product page html', function(done) {
			
			this.timeout(4000);

			supertest
	    	.get(uri)
	    	//.set("Accept", "*/*")
			//.set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:48.0) Gecko/20100101 Firefox/48.0")
			//.set("Accept-language","pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3")
	    	.expect(200, done);
		});
	});

	
	describe('Testing Crawler to Walmart >>',function(done){
		
		before(function(){

			var review = new Review ({
				title: "Indicação 100% para Walmart ",
				description: "Comprei esse fogão com o prazo de entrega para dia 19/08/2016 foi entreguei no dia 04/08/2016 sobre a entrega perfeito deixou no 1º andar e o pessoal da entrega muito educado o fogão muito lindo superou todas minha espectativas. Parabéns Walmart ",
				author: 'thalita ',
				location: 'Curitiba',
				ean: 88888888888888,
				date: '1470366041000',
	  			category: "Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			advertiser:"walmart",
	  			url:"http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1109777/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	  			advertiser:"walmart",
	  			manufacturer: "brastemp",
	  			rating:3,
			});

			var review2 = new Review ({
				title: "Indicação 100% para Walmart ",
				description: "Comprei esse fogão com o prazo de entrega para dia 19/08/2016 foi entreguei no dia 04/08/2016 sobre a entrega perfeito deixou no 1º andar e o pessoal da entrega muito educado o fogão muito lindo superou todas minha espectativas. Parabéns Walmart ",
				author: 'thalita ',
				location: 'Curitiba',
				ean: 88888888888888,
				date: '1470366041000',
	  			category: "Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			advertiser:"walmart",
	  			url:"http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1109777/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	  			advertiser:"walmart",
	  			manufacturer: "brastemp",
	  			rating:3,
			});

			var review3 = new Review ({
				title: "Indicação 100% para Walmart ",
				description: "Comprei esse fogão com o prazo de entrega para dia 19/08/2016 foi entreguei no dia 04/08/2016 sobre a entrega perfeito deixou no 1º andar e o pessoal da entrega muito educado o fogão muito lindo superou todas minha espectativas. Parabéns Walmart ",
				author: 'thalita ',
				location: 'Curitiba',
				ean: 88888888888888,
				date: '1470366041000',
	  			category: "Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			advertiser:"walmart",
	  			url:"http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1109777/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	  			advertiser:"walmart",
	  			manufacturer: "brastemp",
	  			rating:3,
			});

			var arrayReviews = [];
			arrayReviews.push(review);
			arrayReviews.push(review2);
			arrayReviews.push(review3);

			Context.arrayOffers[0].reviews = arrayReviews;
		});
		

		it('Should get productid == 2033536 ,totalReviewsPage == 182 and totalPaginacaoReviews == 46', function(done) {
			this.timeout(5000);
			walmart.getProductContext(Context.body,function(productid,totalReviewsPage,totalPaginacaoReviews){
				productid.should.be.equal('2033536');
				totalReviewsPage.should.be.equal('182');
				totalPaginacaoReviews.should.be.equal(46);
				done();
			});
		});	


		it('Should add info to array products: productid,totalReviewsPage and totalPaginacaoReviews', function(done) {
			this.timeout(20000);
			walmart.setDataProducts(Context.arrayOffers[1],function(productid,totalReviewsPage,totalPaginacaoReviews){
				productid.should.be.equal('2033536');
				totalPaginacaoReviews.should.be.equal(46);
				totalReviewsPage.should.be.equal('182');
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
// Code here will be ignored by JSHint.
/* jshint ignore:end */






