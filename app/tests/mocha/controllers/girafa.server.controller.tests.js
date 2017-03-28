var reController = require('../../../controllers/ricardo_eletro.server.controller.js');
var request = require('request');
var should = require('should');
var host = "http://www.ricardoeletro.com.br";
var phantomUtile = require('../../../utile/phantomjs.server.utile.js');
var uri = "/Produto/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169";
var config = require('../../../../config/config.js');
var url_offer = 'Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169';
var requestUtile = require('../../../utile/requests.server.utile.js');
var reviewController = require('../../../controllers/review.server.controller.js');
var girafaController = require('../../../controllers/girafa.server.controller.js');


describe('Girafa BR unit tests >> ',function(done){

	describe("Test getTotalReviews function >>",function(done){
		it('Should return total reviews == 2', function(done) {
			this.timeout(6000);
			var url = "http://www.girafa.com.br/Telefonia/Celulares/smartphone-display-5-5-android-4-4-gb-mp-branco.htm";
			girafaController.getTotalReviews(url,function(totalReviews,body){
				totalReviews.should.be.equal('2');
				done();
			});
		});
	});
	

	describe("Test parseUrlCrawler function >>",function(done){
		it('Should return parseUrlCrawler == Telefonia/sony/smartphone-sony-xperia-z3-compact-d5833-android-4.4-full-hd-4.6-d5833-wht.htm', function(done) {
			this.timeout(8000);
			var url = "http://ad.zanox.com/ppc/?40871523C2376177&ULP=[[Telefonia/sony/smartphone-sony-xperia-z3-compact-d5833-android-4.4-full-hd-4.6-d5833-wht.htm?utm_source=zanox]]&zpar9=[[43EEF0445509C7205827]]";
			girafaController.parseUrlCrawler(url,function(urlParsed){
				urlParsed.should.be.equal('Telefonia/sony/smartphone-sony-xperia-z3-compact-d5833-android-4.4-full-hd-4.6-d5833-wht.htm');
				done();
			});
		});
	});

	
	describe('Testing getReviewsFromHtml function >>',function(done){

		var Context = {};

		before(function(done){

			this.timeout(50000);
			
			var timeRequest = 1000;
			Context.currentItem = 0;

			var product = new Object ({
				name:"Smartphone Sony Xperia Z3 Compact Desbloqueado Android 4.4 4G 4.6\" 16GB Branco",
				ean:7898501193955,
				category:"Telefonia",
				merchantProductId: 39672,
				urlOffer:'Telefonia/sony/smartphone-sony-xperia-z3-compact-d5833-android-4.4-full-hd-4.6-d5833-wht.htm',
				advertiser:"Girafa BR",
				url:"http://ad.zanox.com/ppc/?40871523C2376177&ULP=[[Telefonia/sony/smartphone-sony-xperia-z3-compact-d5833-android-4.4-full-hd-4.6-d5833-wht.htm?utm_source=zanox]]&zpar9=[[43EEF0445509C7205827]]"
			});


			Context.product = product;

			var urlToCrawler = 	config.girafa_url + 
    							product.urlOffer;

    		console.log("urlToCrawler",urlToCrawler);

			
			var call = new requestUtile();

			call.getHtml(urlToCrawler,timeRequest,function(error,response,body){
				Context.body = body;
				console.log(body);
				done();
			});
		});


		it('Should return arrayReviews with 5 reviews', function(done) {
			this.timeout(50000);
			girafaController.getReviewsFromHtml(Context.body,
												Context.product,
												function(arrayReviews){
													arrayReviews.length.should.be.equal(5);
													arrayReviews[4].rating.should.be.equal(5);
													arrayReviews[4].ean.should.be.equal('7898501193955');
													// arrayReviews[4].manufacturer.should.be.equal(undefined);
													arrayReviews[4].advertiser.should.be.equal('Girafa BR');
													arrayReviews[4].date.should.be.equal('1433188920000');
													arrayReviews[4].author.should.be.equal('Gustavo luiz caetano');
													arrayReviews[4].description.should.be.equal('Muito bom mesmo.');
													arrayReviews[4].title.should.be.equal('Review de Gustavo luiz caetano');
													done();
												});
			});
	});
});