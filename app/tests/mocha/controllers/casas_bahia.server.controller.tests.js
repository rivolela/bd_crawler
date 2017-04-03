var should = require('should');
var requestUtile = require('../../../utile/requests.server.utile.js');
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var config = require('../../../../config/config.js');
var html ='http://www.casasbahia.com.br/Eletroportateis/Mixer/Mixer-Philips-Walita-Viva-Collection-RI1364-Tecnologia-Pro-Blend-4-400W-7718272.html?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletroportateis_Mixer&utm_content=7718272&cm_mmc=zanox_XML-_-ELPO-_-Comparador-_-7718272&zanpid=2282570425064305666';
var url_offer  = '/2345967';
var cbController = require('../../../controllers/casas_bahia.server.controller.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var ZanoxMerchant = require('../../../../config/merchants/zanox.merchant.js');


describe('Casas Bahia BR unit tests:',function(done){


	describe('Testing getContext function >>',function(done){

		var Context = {};
		var call = new requestUtile();

		before(function(done){

			this.timeout(20000);
			// remove double quotes
			var result_html = html.replace(/\”/g, "");
			call.getHtml(result_html,config.timeRequest,function(error,response,body){
				Context.body = body;
				done();
			});
		});


		it('Should return totalPaginacaoReviews === 4', function(done) {

			this.timeout(10000);
			
			cbController.getProductContext(Context.body,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(4);
				done();
			});
		});
	});


	describe('Testing setDataProducts function >>',function(done){

		var Context = {};

		before(function(){

			this.timeout(1000);

			var timeRequest = 1000;
			Context.currentItem = 0;

			var offer = new Object ({
				name:'Mixer Philips Walita Viva Collection RI1364 Tecnologia Pro Blend 4 - 400W',
	  			ean:8710103768692,
	  			category:"Mixer",
	  			merchantProductId: 7718272,
	  			urlOffer:'7718272',
	  			advertiser:"Casas Bahia BR"
			});

			Context.offer = offer;
		});

		it('Should add info to array products: totalPaginacaoReviews == 4', function(done) {
			this.timeout(20000);
			cbController.setDataProducts(Context.offer,function(totalPaginacaoReviews){
				totalPaginacaoReviews.should.be.equal(4);
				done();
			});
		});
	});


	describe('Testing crawlerByProduct function >>',function(done){

		var Context = {};

		before(function(){

			var offer1 = new Object ({
				name:'Mixer Philips Walita Viva Collection RI1364 Tecnologia Pro Blend 4 - 400W',
	  			ean:8710103768692,
	  			category:"Mixer",
	  			merchantProductId: 7718272,
	  			urlOffer:'7718272',
	  			advertiser:"Casas Bahia BR",
  				url:"http://ad.zanox.com/ppc/?41259044C34591010&ULP=[[7718272?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletroportateis_Mixer&utm_content=7718272&cm_mmc=zanox_XML-_-ELPO-_-Comparador-_-7718272]]&zpar9=[[A3697E2455EA755B758F]]"
			});

			var offer2 = new Object ({
				name:'Máquina de Waffle Britânia Golden - Prata',
  				ean:7891356035111,
  				category:"Máquinas de Waffle",
  				merchantProductId: 148901,
  				urlOffer:'148901',
  				advertiser:"Casas Bahia BR",
  				url:"http://ad.zanox.com/ppc/?41259044C34591010&ULP=[[148901?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletroportateis_Maquinas-de-Waffle&utm_content=148901&cm_mmc=zanox_XML-_-ELPO-_-Comparador-_-148901]]&zpar9=[[A3697E2455EA755B758F]]"
			});

			var arrayOffers = [];
			arrayOffers.push(offer1);
			arrayOffers.push(offer2);
			Context.arrayOffers = arrayOffers;
		});


		it('Should contReview == 20', function(done) {
			this.timeout(50000);
			var currentItem = 0;
			cbController.crawlerByProduct(currentItem,
										  Context.arrayOffers,
								 		  function(contReview){
								 		  	console.log("contReview >>",contReview);
								 		  	contReview.should.be.equal(20);
											done();
										  });
		});
	});


	describe('Testing getReviewsFromHtml function >>',function(done){

		var Context = {};

		before(function(done){
			
			this.timeout(10000);

			var timeRequest = 1000;
			Context.currentItem = 0;

			var offer = new Object ({
				name:'Mixer Philips Walita Viva Collection RI1364 Tecnologia Pro Blend 4 - 400W',
	  			ean:8710103768692,
	  			category:"Mixer",
	  			merchantProductId: 7718272,
	  			urlOffer:'7718272',
	  			advertiser:"Casas Bahia BR",
  				url:"http://ad.zanox.com/ppc/?41259044C34591010&ULP=[[7718272?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletroportateis_Mixer&utm_content=7718272&cm_mmc=zanox_XML-_-ELPO-_-Comparador-_-7718272]]&zpar9=[[A3697E2455EA755B758F]]"
			});

			Context.offer = offer;

			var nameOffer = offer.name;
        	var idOffer = offer.merchantProductId;

			var urlToCrawler =  ZanoxMerchant.casas_bahia_url + nameOffer + '-' + idOffer + ".html";
       		// remove double quotes
        	var result_urlToCrawler = urlToCrawler.replace(/\"/g, "");
        	var result_urlToCrawler_2 = result_urlToCrawler.replace(/\+/g, "");
		
			var call = new requestUtile();

			call.getHtml(result_urlToCrawler_2,timeRequest,function(error,response,body){
				Context.data = body;
				done();
			});
		});

		it('Should contain the data below >>', function(done) {
			this.timeout(10000);
			cbController.getReviewsFromHtml(Context.data,
									  			Context.offer,
									  			function(arrayReviews){
									  				arrayReviews.should.containDeep([{author: 'Noemi'}]);
									  				arrayReviews.should.containDeep([{location: 'São Paulo'}]);
									  				arrayReviews.should.containDeep([{date: '1474844400000'}]);
									  				arrayReviews.should.containDeep([{category: 'Mixer'}]);
									  				arrayReviews.should.containDeep([{advertiser: 'Casas Bahia BR'}]);
									  				arrayReviews.should.containDeep([{ean: '8710103768692'}]);
									  				arrayReviews.should.containDeep([{rating: 5}]);
									  				arrayReviews.should.containDeep([{description:'Digo até que é sem legendas, de tão maravilhoso!'}]);
									  				arrayReviews.should.containDeep([{title:'Amei este produto!'}]);
													done();
									  			});
		});

	});


	after(function(){
		reviewController.deleteAllReviews(function(){
			console.log("bd clean");
			//mongoose.connection.close();
		});
	});

});