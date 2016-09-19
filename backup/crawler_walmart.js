var crawlerjs = require('crawler-js');
var Models = require("./models/models"); //Instantiate a Models object so you can access the models.js module.


exports.crawler = function (url,totalPages,ean,advertiser) {
  
  var productid = 0;
var contador = 0;
  getProductId(url,function(productid){
      console.log("get ProductId from url:",url);
      
      contador = contador + 1;
      getProductReviews(productid,totalPages,ean,advertiser,function(data){
        console.log("end get reviews do produto:",productid);
        
        console.log("contador",contador);
      });
  });

  
};


var getProductId = function(url,next){
    var crawler = {
      interval: 1000,  
      getSample: url + '&pageNumber=1',
      get: url + '&pageNumber=1',
      preview: 3,
      extractors: [
        {
        selector: '#rating ',
        callback: function(err, html){
          if(!err){
            data = {};
            data.productid = $('#rating').attr('data-productId');
            productid = data.productid;
            return next(productid);    
          }else{
              console.log(err);
            }
          }

        }
      ]
    }
    crawlerjs(crawler);
};


var getProductReviews = function (productid,totalPages,ean,advertiser,next){
   
    var fimPaginacao = totalPages + 1;

    for (var i = 1; i < fimPaginacao;i++) {
      var crawler2 = {
        interval: 1000,  
        getSample: 'https://www.walmart.com.br/xhr/reviews/'+productid+'/?pageNumber=1',
        get: 'https://www.walmart.com.br/xhr/reviews/'+productid+'/?pageNumber='+i,
        preview: 0,
        extractors: [
          {
            selector: '.customer-review',
            callback: function(err, html,response){
               if(!err){
                // var data = {};
                // data["title"] =  html.children('.customer-review-head').children('.title-customer-review').text();
                // data["description"] = html.children('.description-customer-review').text();
                // data["author"] = html.children('.customer-data').children('.customer-author').text();
                // data["location"] = html.children('.customer-data').children('.location').children('.city-client').text();
                // data["date"] = html.children('.customer-data').children('meta').attr('content');
                // data["ean"] = ean;
                // data["advertiser"] = advertiser;

                var review = new Models.Review({
                  title: html.children('.customer-review-head').children('.title-customer-review').text().replace(/['"]+/g, ''),
                  ean: ean,
                  description: html.children('.description-customer-review').text().replace(/['"]+/g, ''),
                  author: html.children('.customer-data').children('.customer-author').text().replace(/['"]+/g, ''),
                  location: html.children('.customer-data').children('.location').children('.city-client').text().replace(/['"]+/g, ''),
                  date: html.children('.customer-data').children('meta').attr('content'),
                  advertiser: advertiser,
                });
                
                if(html.children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-10')){
                  rating: 1;
                }else if(html.children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-20')){
                  rating: 2;
                }else if(html.children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-30')){
                  rating: 3;
                }else if(html.children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-40')){
                  rating: 4;
                }else if (html.children('.customer-review-head').children('.star-rating').children('.star-rating-content').children('div').hasClass('star-rating-value-50')){
                  rating:5;
                } else {
                  rating:0;
                }


                Models.Review.findOne({ean:review.ean,
                                title:review.title,
                                description:review.title,
                                author:review.author,
                                location:review.location,
                                advertiser:review.advertiser,
                                date:review.advertiser,
                                },function(err,buscaReview) {
                                    if(buscaReview == null) {
                                        review.save(function(err,next) {
                                          if(!err) {
                                            return(console.log("review saved: ",review));
                                          }
                                          else {
                                            return(console.log("error save review: ",err));
                                          }
                                        });
                                    }else{
                                      console.log("review duplicado",buscaReview);
                                    }
                });

               return next(review);
           
               }else{
                console.log(err);
              }
            }
          }
        ]
      }
      crawlerjs(crawler2);

    };

};


