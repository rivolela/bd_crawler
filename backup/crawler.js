var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var crawlerjs = require('crawler-js');

//var START_URL = "http://www.arstechnica.com";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = '';
var baseUrl = '';


//var urlToCrawler = "http://www.uol.com.br";
//var getUrlSample = "https://www.walmart.com.br/item/1888076/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2205787675729175552&utm_term=httpwwwskimlinkscom";

//var urlToCrawler = "http://ad.zanox.com/ppc/?25371034C45550273&ULP=[[2057628/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox]]&zpar9=[[43EEF0445509C7205827]]";
//pagesToVisit.push(START_URL);



exports.getHtml = function(getUrlSample,urlToCrawler,preview,seletor,next){

    //var voltar = next();

    var crawler = {
      interval: 5000,  
      getSample: getUrlSample,
      get: urlToCrawler,
      preview: preview,
      extractors: [
        {
        selector: seletor,
        callback: function(err, html){
          if(!err){
            data = {};
            data.productid = $('#rating').attr('data-productId');
            productid = data.productid;
            //console.log('productid:',productid);
            
            //return next(productid); 
            //var data = JSON.parse(body);
            //data = {};
            //data.productid = $('#rating').attr('data-productId');
            //productid = data.productid;
            //return next(html);  
            //console.log(html); 
            return next(data);
          }else{
              console.log(err);
            }
          }

        }
      ]
    }
    crawlerjs(crawler);

};



exports.getHtmlReviews = function(getUrlSample,urlToCrawler,preview,seletor,productid,next){

    //var voltar = next();

    var crawler = {
      interval: 5000,  
      getSample: getUrlSample,
      get: urlToCrawler,
      preview: preview,
      extractors: [
        {
        selector: seletor,
        callback: function(err, html){
          
          if(!err){
            console.log("parser reviews from product:",productid)
            var data = {};
            data["title"] =  html.children('.customer-review-head').children('.title-customer-review').text();
            data["description"] = html.children('.description-customer-review').text();
            data["author"] = html.children('.customer-data').children('.customer-author').text();
            data["location"] = html.children('.customer-data').children('.location').children('.city-client').text();
            data["date"] = html.children('.customer-data').children('meta').attr('content');
            // data["ean"] = ean;
            // data["advertiser"] = advertiser;
            console.log('\n');
            //console.log(data);
            next(data);
          }else{
             console.log(err);
           }
           //return next();
          }

        }
      ]
    }
    crawlerjs(crawler);

};


//this.getHtml(getUrlSample,getUrlSample,0,'#rating ');

// function crawlTest() {
//   request({
//       url: urlToCrawler, //URL to hit
//       //qs: {from: 'blog example', time: +new Date()}, //Query string data
//       method: 'GET', //Specify the method
//       headers: { //We can define headers too
//           'Content-Type': 'json',
//       }
//   }, function(error,response,body){
//       if(error) {
//           console.log(error);
//       } else {
//         console.log(response.statusCode);
//         //var data = JSON.parse(body);
//         console.log(body);
//       }
//   });
// }

// function crawl() {
//   if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
//     console.log("Reached max limit of number of pages to visit.");
//     return;
//   }
//   var nextPage = pagesToVisit.pop();
//   if (nextPage in pagesVisited) {
//     // We've already visited this page, so repeat the crawl
//     crawl();
//   } else {
//     // New page we haven't visited
//     visitPage(nextPage, crawl);
//   }
// }

// function visitPage(url, callback) {
//   // Add page to our set
//   pagesVisited[url] = true;
//   numPagesVisited++;

//   // Make the request
//   console.log("Visiting page " + url);
//   request(url, function(error, response, body) {
//     // Check status code (200 is HTTP OK)
//     console.log("Status code: " + response.statusCode);
//     if(response.statusCode !== 200) {
//       callback();
//       return;
//     }
//     // Parse the document body
//     var $ = cheerio.load(body);
//     console.log($);
//     // var isWordFound = searchForWord($, SEARCH_WORD);
//     // if(isWordFound) {
//     //   console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
//     // } else {
//     //   collectInternalLinks($);
//     //   // In this short program, our callback is just calling crawl()
//     //   callback();
//     // }
//   });
// }

// function searchForWord($, word) {
//   var bodyText = $('html > body').text().toLowerCase();
//   return(bodyText.indexOf(word.toLowerCase()) !== -1);
// }

// function collectInternalLinks($) {
//     var relativeLinks = $("a[href^='/']");
//     console.log("Found " + relativeLinks.length + " relative links on page");
//     relativeLinks.each(function() {
//         pagesToVisit.push(baseUrl + $(this).attr('href'));
//     });
//}