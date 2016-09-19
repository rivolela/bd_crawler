var crawlerjs = require('crawler-js');

var crawler = {
  interval: 1000,  
  getSample: 'https://www.walmart.com.br/item/1141205/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2201370806633006080&utm_term=httpwwwskimlinkscom&pageNumber=1',
  get: 'https://www.walmart.com.br/item/1141205/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2201370806633006080&utm_term=httpwwwskimlinkscom&pageNumber=[numbers:1:100:5]',
  preview: 3,
  extractors: [
    {
      selector: '.customer-review',
      callback: function(err, html){
        if(!err){
          data = {};
          data.title = html.children('.customer-review-head').children('.title-customer-review').text();
          data.description = html.children('.description-customer-review').text();
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

crawlerjs(crawler);



