    // should just be require("phridge") in your code
var phridge = require("phridge/lib/main.js");
var searchUrl = "http://www.pontofrio.com.br/Eletrodomesticos/GeladeiraeRefrigerador/FrostFree/Refrigerador-Brastemp-Clean-BRM39EB-Frost-Free-Duplex-352-L-Branco-46703.html?IdProduto=30475&recsource=btermo&rectype=p1_op_f_s1";
var timeRequestHtml;
var resultPhantom;
var phantom = require("phantom");


    var getHtml = function(searchUrl,timeRequest,next){

        timeRequestHtml = timeRequest;
        console.log(searchUrl);

        setTimeout(timeControlCrawler,timeRequest,function(){

            phridge.spawn({
                proxy: '8.8.8.8:53'
                // proxyAuth: "john:1234",
                // loadImages: false,
                // // passing CLI-style options does also work
                //  "--remote-debugger-port": 8888
                //"--proxy=8.8.8.8:53"
            })          
            .then(function (phantom) {
                // phantom.openPage(url) loads a page with the given url
                return phantom.openPage(searchUrl);
            })
            .then(function (page) {
                // page.run(fn) runs fn inside PhantomJS
                //page.injectJs = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js';
                page.customHeaders = {
                     Referer: searchUrl
                };
                page.settings = {
                    userAgent: "request",
                    resourceTimeout: 5000,
                    //"Accept-Encoding": "gzip" // or "gzip,deflate"
                };

                return page.run(function (resolve) {
                    
                    // Here we're inside PhantomJS, so we can't reference variables in the scope

                    // 'this' is an instance of PhantomJS' WebPage as returned by require("webpage").create()
                    // return this.evaluate(function () {
                    //     return document.querySelector("h1").innerText;
                    // });
                   // window.setInterval(function(page){
                        var html = this.evaluate(function(){
                        //return $(document).find("title").text();
                        //$("a[href$='#ReviewHeader']")[1].onclick();
                         //$( ".pr-page-next a")[1].onclick();
                         //return document.getElementsByTagName('body')[0].innerHTML;
                         // if(!window.jQuery){
                         //    return false
                         // }else{
                         //    return true
                         // }

                        //return POWERREVIEWS.display.getReviewsFromMeta(2, '30475_3', 'pt_BR', 'engine-30475_3-pt_BR', POWERREVIEWS.common.getOptions('engine-30475_3-pt_BR')); location.hash='#'; location.hash='#pr-header-back-to-top-link';
                        //return document.getElementsByTagName('body')[0].innerHTML;
                         //return document.getElementsByTagName('body')[0].innerHTML;
                                      
                         //return document.getElementsByTagName('body')[0].innerHTML;
                        //return document.getElementsByTagName('body')[0].innerHTML;
                        return $("a[href$='#pr-header-30475_3']")[1].onclick();

                        });
                    });

                    // var html = this.evaluate(function(){
                    //     //return $(document).find("title").text();
                    //     //$("a[href$='#ReviewHeader']")[1].onclick;
                    //     return document.getElementsByTagName('body')[0].innerHTML;
                    //     //return $("a[href$='#pr-header-30475_3']")[1].onclick();

                    // });

                    resolve(html);

                });
            })
            .then(function (html) {
                 // inside node again
                console.log("Result PhantomJS >> " + html);
                resultPhantom = html;
                closePhantomjsProcess();
                return next(resultPhantom);
                //closePhantomjsProcess()
            })
            .catch(function (err) {
                console.error(err.stack);
            });
         //    .then(function(){
            //  closePhantomjsProcess()
            // })

        });
    };



    var closePhantomjsProcess = function (){
         // phridge.disposeAll() exits cleanly all previously created child processes.
        // This should be called in any case to clean up everything.
        //.then(closePhantomjsProcess());
        console.log("All processes created by phridge.spawn() have been terminated");
        return phridge.disposeAll();
    };


var timeControlCrawler = function(next){
        console.log("calling to crawler every >> ",timeRequestHtml," miliseconds");
        next();
    };


getHtml(searchUrl,3000,function(resultPhantom){
    //console.log(resultPhantom);
});