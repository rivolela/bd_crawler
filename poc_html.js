var http = require('http');
var url = require('url');
var request = require('request');
var url = "http://ad.zanox.com/ppc/?31856659C46689111&ULP=[[/produto/Eletrodomesticos/Refrigerador-Geladeira-Electrolux-Frost-Free-2-portas-382-Litros-DF42?utm_campaign=xml_produtos&portal=4256CC361F2545F3488AFD861B38B9B6&utm_source=zanox&utm_medium=Afiliados]]&zpar9=[[43EEF0445509C7205827]]";

// request(url, function (error, response, body) {
//     console.log(response.headers); 
//     //console.log(body); // Print the google web page.
// })


// request({url:url,followRedirect :false}, function (error, response, body) {
//     console.log(response.headers) 
//     console.log(body)
// })


var url_01 = url.split('[[');
console.log(url_01);
var url_02 = url_01[1].split('?');
console.log(url_02);
var url_03 = "https://www.colombo.com.br" + url_02[0];
console.log(url_03);
