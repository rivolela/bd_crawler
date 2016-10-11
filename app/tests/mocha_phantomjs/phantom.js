// Print all of the news items on Hacker News
var jsdom = require("jsdom");

jsdom.env({
  url: "http://www.ricardoeletro.com.br/Produto/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169",
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (err, window) {
    var $ = window.$;
    var title = $( ".comentarios-avaliacaos" ).html();
    console.log("title",title);
    // $("td.title:not(:last) a").each(function() {
    //   console.log(" -", $(this).text());
    // });
  }
});