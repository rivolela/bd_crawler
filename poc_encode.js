//var json = require('locutus/php/json/json_decode');
// http://www.criarweb.com/artigos/codificar-decodificar-cadeias-utf8.html
var json_encode = require('locutus/php/json/json_encode');
var json_decode = require('locutus/php/json/json_decode');
var utf8_decode = require('locutus/php/xml/utf8_decode');
var utf8_encode = require('locutus/php/xml/utf8_encode');
var jschardet = require("jschardet")

console.log(json_encode('Kevin'));
console.log(json_decode('[ 1 ]'));


var texto = "Refrigerador/Geladeira Electrolux Degelo PrÃ¡tico, 1 Porta, 240 Litros - RE31";
console.log(jschardet.detect(texto));

var textoISO = utf8_decode(texto);
console.log(textoISO);
console.log(jschardet.detect(textoISO));

jschardet.detect(textoISO);

