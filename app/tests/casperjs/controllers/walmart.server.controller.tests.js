/*jshint esversion: 6 */
var url = "https://www.walmart.com.br/item/35172/sk?utm_medium=afiliados&utm_source=zanox&utm_campaign=xml_zanox&utm_term=zanox&zanpid=2224545894140288000&utm_term=httpwwwskimlinkscom";
const fs = require('fs');

casper.test.begin('Walmart BR Tests >> save product page html', 1, function(test) {

    casper.start(url, function() {

      test.assertHttpStatus(200);

      test.tearDown(function() {
        //casper.capture("export.png");
        //'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
        //getHTML()
        //Signature: getHTML([String selector, Boolean outer])
        fs.write("./public_test/walmart.html", casper.getHTML(undefined, true),  'w');
      });
     
    }).run(function() {
        test.done();
    });
});

