//var phridge = require("phridge/lib/main.js");
//var phantom = require("phridge/lib/Phantom.js");
//var system = require('system');
// node 
//var phantom = new Phantom();

// node
var phantom = require("phantom");
var _ph, _page, _outObj;

phantom.create().then(ph => {
    _ph = ph;
    return _ph.createPage();
}).then(page => {
    _page = page;
    return _page.open('https://stackoverflow.com/');
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