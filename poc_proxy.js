const dns = require('dns');
var requestUtile = require('./app/utile/requests.server.utile.js');

dns.lookup('www.ricardoeletro.com.br', (err, addresses, family) => {
  console.log('addresses:', addresses);

  var call = new requestUtile();

    call.getHtml('http://'+ addresses,1000,function(error,response,body){
       console.log(response.status);
       console.log(response.body);
        // $ = cheerio.load(body);
        // var productid = $('.comentarios-avaliacao').attr('produtoid');
        // if(productid === undefined){
        //   productid = 0;
        // }
    });
});