
// dns.lookup('nodejs.org', (err, addresses, family) => {
//   console.log('addresses:', addresses);
//   console.log('addresses:', family);
// });

// var dns = require('dns');
 
// dns.resolve4('www.ricardoeletro.com.br', function (err, addresses) {
//   if (err) throw err;
 
//   console.log('addresses: ' + JSON.stringify(addresses));
 
//   addresses.forEach(function (a) {
//     dns.reverse(a, function (err, domains) {
//       if (err) {
//         console.log('reverse for ' + a + ' failed: ' +
//           err.message);
//       } else {
//         console.log('reverse for ' + a + ': ' +
//           JSON.stringify(domains));
//       }
//     });
//   });
// });
var requestUtile = require('./app/utile/requests.server.utile.js');
const dns = require('dns');

var start = function(){


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

// var dns = require('native-dns');
// var util = require('util');

// var question = dns.Question({
//   name: 'www.ricardoeletro.com.br',
//   type: 'A',
// });

// var start = Date.now();

// var req = dns.Request({
//   question: question,
//   server: { address: '8.8.8.8', port: 53, type: 'udp' },
//   timeout: 1000,
// });

// req.on('timeout', function () {
//   console.log('Timeout in making request');
// });

// req.on('message', function (err, answer) {
//   answer.answer.forEach(function (a) {
//   	//console.log(a);
//     //console.log(a.address);
//     //call(a);
//     var call = new requestUtile();

//     call.getHtml('http://'+ a.address,1000,function(error,response,body){
//        console.log(response.status);
//         // $ = cheerio.load(body);
//         // var productid = $('.comentarios-avaliacao').attr('produtoid');
//         // if(productid === undefined){
//         //   productid = 0;
//         // }
//     });
	
//   });
// });

// req.on('end', function () {
//   var delta = (Date.now()) - start;
//   console.log('Finished processing request: ' + delta.toString() + 'ms');
// });

// req.send()

// }


// var call = function(a){

// 	console.log(a);
//     console.log(a.address);

// 	var call = new requestUtile();

//     call.getHtml('http://'+ a.address,1000,function(error,response,body){
//        console.log(response.status);
//         // $ = cheerio.load(body);
//         // var productid = $('.comentarios-avaliacao').attr('produtoid');
//         // if(productid === undefined){
//         //   productid = 0;
//         // }
//     });
	
}

exports.start = start;

// var dns = require('node-dns');
// var request;

// request = dns.resolve('www.ricardoeletro.com', 'A', '8.8.8.8', function (err, results) {
//   console.log("---- Direct Request ----");
//   results.forEach(function (result) {
//     console.log(result);
//   });
//   console.log("------------------------");
//});