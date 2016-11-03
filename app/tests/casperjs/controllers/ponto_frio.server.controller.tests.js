/*jshint esversion: 6 */
var url = "http://www.pontofrio.com.br/Eletrodomesticos/Refrigeradores/Frigobar/Frigobar-Philco-PH85-–-70-Litros-462100.html?utm_source=zanox&utm_medium=afiliado&utm_campaign=Eletrodomesticos_Frigobar&utm_content=462101&cm_mmc=zanox_XML-_-ELDO-_-Comparador-_-462101&zanpid=2224562457236898816";
const fs = require('fs');

casper.test.begin('Ponto Frio BR Tests >> save product page html', 1, function(test) {

    casper.start(url, function() {

      test.assertHttpStatus(200);

      test.tearDown(function() {
        //casper.capture("export.png");
        //'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
        //getHTML()
        //Signature: getHTML([String selector, Boolean outer])
        fs.write("./public_test/ponto_frio.html", casper.getHTML(undefined, true),  'w');
      });
     
    }).run(function() {
        test.done();
    });
});

