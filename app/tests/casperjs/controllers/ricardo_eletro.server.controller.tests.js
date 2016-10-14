/*jshint esversion: 6 */
var url = "http://www.ricardoeletro.com.br/Produto/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169";
var reviews_01 = 'http://www.ricardoeletro.com.br/Produto/Comentarios/5211/1';
var reviews_02 = 'http://www.ricardoeletro.com.br/Produto/Comentarios/5211/2';
const fs = require('fs');


casper.test.begin('Ricardo Eletro BR Tests >> save product page html', 1, function(test) {

    casper.start(url, function() {

      test.assertHttpStatus(200);

      test.tearDown(function() {
        //casper.capture("export.png");
        //'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
        //getHTML()
        //Signature: getHTML([String selector, Boolean outer])
        fs.write("./public_test/ricardo_eletro.html", casper.getHTML(undefined, true),  'w');
      });


     //  test.assertEquals('85169',this.evaluate(function () { 
     //    return document.getElementsByClassName("comentarios-avaliacao")[0].getAttribute("produtoid");
    	// }), 'Test get produtoid');


    	// test.assertTrue(this.evaluate(function () { 
     //    	return document.getElementById("SetaComentariosDireita").getAttribute("paginatotal") > '20';
    	// }), 'Test get total paginacao ( should be > 20 )');

     
    }).run(function() {
        test.done();
    });

});


casper.test.begin('Ricardo Eletro BR Tests >> >> save review page html ', 1, function(test) {

    casper.start(reviews_01, function() {

      test.assertHttpStatus(200);

      test.tearDown(function() {
        //casper.capture("export.png");
        //'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
        //getHTML()
        //Signature: getHTML([String selector, Boolean outer])
        fs.write("./public_test/ricardo_eletro_review.html", casper.getHTML(undefined, true),  'w');
      });

    
    }).run(function() {
        test.done();
    });
});