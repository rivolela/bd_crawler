var URL = require('url-parse');
var request = require('request');
var timeRequestHtml;
var iconv = require('iconv-lite');

module.exports = function(){

	function getJson(searchUrl,next) {
		request({
	  		url: searchUrl, //URL to hit
	 		method: 'GET', //Specify the method
	    	headers: { //We can define headers too
	    		'User-Agent': 'request',
	    		'Content-Type': 'application/json;charset=UTF-8',
	    		}
	  		},
	  		function(error,response,body){
	  			if(error) {
	    			console.log("error",error);
	    			console.log("response",response);
	 			} 
	 			else{
	    			var data = JSON.parse(body);
	    			return next(data,response,error);
	   			}
	  	});
	}


    function getHtml(searchUrl,timeRequest,next) {

		timeRequestHtml = timeRequest;

    	setTimeout(timeControlCrawler,timeRequestHtml,function(){
    		request({
	    		url: searchUrl, //URL to hit
	      		//qs: {from: 'blog example', time: +new Date()}, //Query string data
	      		method: 'GET', //Specify the method
	      		headers: { //We can define headers too
	        		'User-Agent': 'request',
	         		'Content-Type': 'text/html',
	      		},
	      		encoding: null
	  		},function(error,response,body){
	  	 		if(error) {
	     		   console.log(error);
	      		   //return next(error);
	      		} else {
	        		console.log("request status code >> ",response.statusCode);
	        		var bodyWithCorrectEncoding = iconv.decode(body, 'UTF-8');
	        		return next(error,response,bodyWithCorrectEncoding);
	      		}
	  		});
    	});
	}


	function setTimeOutHtml(timeRequest,next){
		this.timerCrawler = newTimeOut;
		return next();
	}


  	function timeControlCrawler(next){
    	console.log("calling to crawler every >> ",timeRequestHtml," miliseconds");
    	next();
  	}


	return {
    	// getJson: function() {
     //            appendText("called publicMethod()");
     //            getJson();
     //    },

        getJson: getJson,
        getHtml: getHtml,
        setTimeOutHtml: setTimeOutHtml
    };
};

