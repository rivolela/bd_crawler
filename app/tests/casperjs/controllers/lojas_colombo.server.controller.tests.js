/*jshint esversion: 6 */
var url = "https://www.colombo.com.br/produto/Eletrodomesticos/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-310-Litros-DF36A?#produto-avalicoes-title";
const fs = require('fs');

casper.test.begin('Lojas Colombo BR Tests >> save product page html', 1, function(test) {

    casper.start(url, function() {

      test.assertHttpStatus(200);

      test.tearDown(function() {
        //casper.capture("export.png");
        //'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
        //getHTML()
        //Signature: getHTML([String selector, Boolean outer])
        fs.write("./public_test/lojas_colombo.html", casper.getHTML(undefined, true),  'w');
      });
     
    }).run(function() {
        test.done();
    });
});

