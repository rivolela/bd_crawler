
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



var dns = require('native-dns');
var server = dns.createServer();

server.on('request', function (request, response) {
  //console.log(request)
  response.answer.push(dns.A({
    name: request.question[0].name,
    address: '127.0.0.1',
    ttl: 600,
  }));
  response.answer.push(dns.A({
    name: request.question[0].name,
    address: '127.0.0.2',
    ttl: 600,
  }));
  response.additional.push(dns.A({
    name: 'hostA.example.org',
    address: '127.0.0.3',
    ttl: 600,
  }));
  response.send();
});

server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

server.serve(15353);













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
//   	console.log(a);
//     console.log(a.address);
//   });
// });

// req.on('end', function () {
//   var delta = (Date.now()) - start;
//   console.log('Finished processing request: ' + delta.toString() + 'ms');
// });

// req.send()

// var dns = require('node-dns');
// var request;

// request = dns.resolve('www.ricardoeletro.com', 'A', '8.8.8.8', function (err, results) {
//   console.log("---- Direct Request ----");
//   results.forEach(function (result) {
//     console.log(result);
//   });
//   console.log("------------------------");
//});