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

	describe('Testing requests to Walmart >>',function(done){
		it('Should return 200 to call walmart product page html', function(done) {
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

			// mongoose.connect(config.db, function(error) {
   //          	if (error) {
   //          		console.error('Error while connecting:\n%\n', error);
   //          	}else{
   //          		console.log('connected');
   //          	}
   //         	});

			var timeRequest = 0;
			walmart.setTimeRequest(timeRequest,function(){
				console.log("set new value for request ( Walmart Test )",timeRequest);
			});

			var product1 = new Object ({
				name:'Fogao de Embutir 5 Bocas Brastemp Clean BYS5TAR Inox com Timer',
	  			ean:77777777777777,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 1109777,
	  			url:"http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1109777/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	  			advertiser:"walmart",
	  			totalReviewsPage :4,
          		totalPaginacaoReviews: 1
			});

			var product2 = new Object ({
				name:'Freezer/Refrigerador Vertical Brastemp Flex 228 Litros Frost Free BVR28HR Inox',
	  			ean:88888888888888,
	  			category:"Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			merchantProductId: 1109777,
	  			url:"http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[35172/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	  			advertiser:"walmart",
	  			totalReviewsPage :8,
          		totalPaginacaoReviews: 1
			});

			var arrayProducts = [];
			arrayProducts.push(product1);
			arrayProducts.push(product2);

			Context.currentItem = 0; 
			Context.arrayProducts = arrayProducts;
			Context.currentPaginationReview = 0;


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

			arrayProducts[0].reviews = arrayReviews;
			arrayProducts[1].reviews = arrayReviews;

			call.getHtml(Context.arrayProducts[1].url,timeRequest,function(error,response,body){
				Context.body = body;
				//done();
			});
		});
			

		it('Should add info to array products: productid,totalReviewsPage and totalPaginacaoReviews', function(done) {
			this.timeout(5000);
			walmart.setDataProducts(Context.currentItem,Context.arrayProducts,function(arrayProductsWalmart){
				arrayProductsWalmart[1].dataProductId.should.be.equal('2033536');
				arrayProductsWalmart[1].totalPaginacaoReviews.should.be.above(40);
				arrayProductsWalmart[1].totalReviewsPage.should.be.above(100);
				done();
			});
		});


		it('Should return arrayProductsWalmart[0], for pagination 0, with 4 reviews', function(done) {
			walmart.getReviewsFromHtml(	Context.body,
										Context.arrayProducts[1],
										function(arrayReviews){
												arrayReviews.length.should.be.equal(4);
												done();
										});
		});


		// it('Should saveReviewsToPickout without error', function(done) {
		// 	walmart.saveReviewsToPickoout(Context.currentItem,Context.arrayProducts,function(arrayProductsWalmart){
		// 		// console.log(Error);
		// 		// should.not.exist(Error);
		// 		done();
		// 	});
		// });



		after(function(){
			reviewController.deleteAllReviews(function(){
				console.log("bd clean");
				//mongoose.connection.close();
			});
		});

	});

});
// Code here will be ignored by JSHint.
/* jshint ignore:end */






