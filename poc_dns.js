//var start = function(){

  console.log("aa");
  var request = require('request');

  var url = 'http://www.ricardoeletro.com.br/Produto/Refrigerador-Geladeira-Cycle-Defrost-Duas-Portas-Inox-475L-DC51X-Electrolux/256-270-274-406808/';
  var proxy = 'http://rivolela:Rovel@1976@proxy-br1.vpnsecure.me:8080';

  request.get({ url: url, proxy: proxy }, function(err, res, body) {
    console.log(body);
    console.log(res.headers); 
    console.log(res.statusCode);
    console.log(err);
  });

	
//}

//exports.start = start;

