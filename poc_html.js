var request = require("request");

request({
  uri: "http://ad.zanox.com/ppc/?26466855C21529319&ULP=[[RefrigeradorGeladeira-Electrolux-Multidoor-579-Litros-Inox-DM83X/256-270-276-593279/?utm_source=Zanox&prc=8803&utm_medium=CPC_Eletrodomesticos_Zanox&utm_campaign=Refrigerador&utm_content=Side_by_Side&cda=E198-E863-BA87-DC80]]&zpar9=[[43EEF0445509C7205827]]",
  method: "GET",
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10,
  gzip: true
}, function(error, response, body) {
  console.log(body);
});