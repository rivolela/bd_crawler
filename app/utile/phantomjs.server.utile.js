// should just be require("phridge") in your code
var phridge = require("phridge/lib/main.js");
var searchUrl = "http://www.ricardoeletro.com.br/Produto/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169";
var timeRequestHtml;
var reviews = 'http://www.ricardoeletro.com.br/Produto/Comentarios/5211/1';
var resultPhantom;

module.exports = function(){


	var timeControlCrawler = function(next){
		console.log("calling to crawler every >> ",timeRequestHtml," miliseconds");
	   	next();
	}


	var startPhantomjsProcess = function(){
		console.log("open phridge.spawn() process");
	 	return phridge.spawn()
	}


	var closePhantomjsProcess = function (){
		console.log("All processes created by phridge.spawn() have been terminated");
		return phridge.disposeAll()
	}


	var getHtml = function(searchUrl,timeRequest,next){

		timeRequestHtml = timeRequest;

		setTimeout(timeControlCrawler,timeRequest,function(){

			// phridge.spawn() creates a new PhantomJS process
			startPhantomjsProcess()

		    .then(function (phantom) {
		        // phantom.openPage(url) loads a page with the given url
		        return phantom.openPage(searchUrl);
		    })
		    .then(function (page) {
		        // page.run(fn) runs fn inside PhantomJS
		        return page.run(function (resolve) {
		            // Here we're inside PhantomJS, so we can't reference variables in the scope

		            // 'this' is an instance of PhantomJS' WebPage as returned by require("webpage").create()
		            // return this.evaluate(function () {
		            //     return document.querySelector("h1").innerText;
		            // });
		        	var html = this.evaluate(function(){
						return document.getElementsByTagName('body')[0].innerHTML;
					});

					resolve(html);

		        });
		    })
		    .then(function (html) {
		         // inside node again
		    	//console.log("Result PhantomJS >> " + html);
		    	resultPhantom = html;
		    	closePhantomjsProcess();
		    	return next(resultPhantom);
		    	//closePhantomjsProcess()
			})
			.catch(function (err) {
		        console.error(err.stack);
		    })
		 //    .then(function(){
			// 	closePhantomjsProcess()
			// })

		});

		

	    // phridge.disposeAll() exits cleanly all previously created child processes.
	    // This should be called in any case to clean up everything.
	    //.then(closePhantomjsProcess());

	}

	return {
        getHtml: getHtml,
        startPhantomjsProcess: startPhantomjsProcess,
        timeControlCrawler: timeControlCrawler,
    };

};

