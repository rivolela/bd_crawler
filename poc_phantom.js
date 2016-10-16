/ node
phantom.run("h1", function (selector, resolve) {
    // this code runs inside PhantomJS

    phantom.addCookie("cookie_name", "cookie_value", "localhost");

    var page = webpage.create();
    page.customHeaders = {
        Referer: "http://google.com"
    };
    page.settings = {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5)"
    };
    page.open("http://www.google.com", function () {
        var text = page.evaluate(function (selector) {
            return document.querySelector(selector).innerText;
        }, selector);

        // resolve the promise and pass 'text' back to node 
        resolve(text);
    });
}).then(function (text) {
    // inside node again
    console.log("The element contains the following text: " + text);
});