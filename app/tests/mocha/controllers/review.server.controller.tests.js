var config = require('../../../../config/config.js');
var mongoose = require('mongoose');
var request = require('request');
var should = require('should');
var requestsUtile = require('../../../utile/requests.server.utile.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var assert = require("assert");
var supertest = require("supertest")("https://www.walmart.com.br");
var apiZanox = "http://api.zanox.com/json/2011-03-01/products?connectid=43EEF0445509C7205827&q=fogao+brastemp&programs=12011";


/* jshint ignore:start */
describe('Review Unit Tests:',function(done){

	var currentPage = 0;
	var currentItem = 0;
	//var models = new Models();

	var Context = {};
  
	describe('Testing BD >>',function(){

		before(function(){

			// mongoose.connect(config.db, function(error) {
   //          	if (error) {
   //          		console.error('Error while connecting:\n%\n', error);
   //          	}else{
   //          		console.log('connected');
   //          		done();
   //          	}
   //         	});

			var review1 = new Object ({
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

			var review2 = new Object ({
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

			var review3 = new Object ({
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

			var review4 = new Object ({
				title: "Indicação 100% para Walmart ",
				description: "Comprei esse fogão com o prazo de entrega para dia 19/08/2016 foi entreguei no dia 04/08/2016 sobre a entrega perfeito deixou no 1º andar e o pessoal da entrega muito educado o fogão muito lindo superou todas minha espectativas. Parabéns Walmart ",
				author: 'thalita ',
				location: 'Curitiba',
				ean: 111111111111,
				date: '1470366042000',
	  			category: "Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			advertiser:"walmart",
	  			url:"http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1109777/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	  			advertiser:"walmart",
	  			manufacturer: "brastemp",
	  			rating:3,
			});


			var review5 = new Object ({
				title: "Indicação 100% para Walmart ",
				description: "Comprei esse fogão com o prazo de entrega para dia 19/08/2016 foi entreguei no dia 04/08/2016 sobre a entrega perfeito deixou no 1º andar e o pessoal da entrega muito educado o fogão muito lindo superou todas minha espectativas. Parabéns Walmart ",
				author: 'thalita ',
				location: 'Curitiba',
				ean: 00000000000,
				date: '777777777777',
	  			category: "Eletrodomésticos / Fogões / Embutir 5 Bocas",
	  			advertiser:"walmart",
	  			url:"http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[1109777/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]",
	  			advertiser:"walmart",
	  			manufacturer: "brastemp",
	  			rating:3,
			});


			var arrayReviews = [];
			arrayReviews.push(review1);
			arrayReviews.push(review2);
			arrayReviews.push(review3);

			Context.arrayReviews = arrayReviews; 
			Context.review4 = review4; 
			Context.review5 = review5; 
		});


		it('Should save one review in bd >>',function(done){
			reviewController.save(Context.review4,function(err){
				should.not.exist(err);
				done();
			});
		});


		it('Should save array offers in bd >>',function(done){
			var currentItem = 0;
			reviewController.saveArrayReviews(currentItem,Context.arrayReviews,function(arrayReviews){
				arrayReviews.length.should.be.equal(3);
				done();
			});
		});


		it('Should create the review5 and review should be different to null >>',function(done){
			var query = {date:'777777777777'};
			var update = Context.review5;
			reviewController.findOneAndUpdate(query,update,function(err,review){
				should.not.exist(err);
				should.exist(review);
				done();
			});
		});


		it('Should update the attribute date of review5 to 999999999 >>',function(done){
			var query = {date:'777777777777'};
			var update = Context.review5;
			update.date = '999999999';
			reviewController.findOneAndUpdate(query,update,function(err,review){
				review.date.should.be.equal('999999999');
				done();
			});
		});


		it('Should execute the query default from function, when the parameter query passed to be null or {""} >>',function(done){
			var query = null;
			var update = Context.review4;
			update.location = 'São Paulo';
			reviewController.findOneAndUpdate(query,update,function(err,review){
				review.location.should.be.equal('São Paulo');
				done();
			});
		});

		after(function(){
			reviewController.deleteAllReviews(function(){
				console.log("bd clean");
				//mongoose.connection.close();
			});
		});

	});

});
/* jshint ignore:end */


