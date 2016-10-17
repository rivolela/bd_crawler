//var phridge = require("phridge/lib/main.js");
//var phantom = require("phridge/lib/Phantom.js");
//var system = require('system');
// node 
//var phantom = new Phantom();

// node
var phantom = require("phantom");
var _ph, _page, _outObj;
var url = "http://www.ricardoeletro.com.br/Produto/RefrigeradorGeladeira-Electrolux-Multidoor-579-Litros-Inox-DM83X/256-270-276-593279/?utm_source=Zanox&prc=8803&utm_medium=CPC_Eletrodomesticos_Zanox&utm_campaign=Refrigerador&utm_content=Side_by_Side&cda=E198-E863-BA87-DC80";

phantom.create(["--ignore-ssl-errors=true", "--local-to-remote-url-access=true","--load-images=no"],{ logLevel: 'info'}).then(ph => {
    _ph = ph;
    return _ph.createPage();
}).then(page => {
    _page = page;
    return _page.open(url);
}).then(status => {
    console.log(status);
    _outObj = status;
    return _page.property('content')
}).then(content => {
    console.log(content);
    _page.close();
    _ph.exit();
    getOutObject(_outObj);
}).catch(e => console.log(e));

function getOutObject(_outObj) {
    console.log("_outObj",_outObj);
}


"--ignore-ssl-errors=true", "--local-to-remote-url-access=true"