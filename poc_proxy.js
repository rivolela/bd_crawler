// var HttpProxyAgent = require('http-proxy-agent');  
var request = require('request');  

request.get('http://10.255.255.1', {timeout: 1500}, function(err) {
    console.log(err.code === 'ETIMEDOUT');
    // Set to `true` if the timeout was a connection timeout, `false` or
    // `undefined` otherwise.
    console.log(err.connect === true);
    process.exit(0);
});