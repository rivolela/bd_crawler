var URL = require('url-parse');
var request = require('request');
var timeRequestHtml;
var iconv = require('iconv-lite');
var http = require("http");


module.exports = function(){

	function getJson(searchUrl,next) {
		request({
	  		url: searchUrl, //URL to hit
	 		method: 'GET', //Specify the method
	    	headers: { //We can define headers too
	    		'User-Agent': 'request',
	    		'Content-Type': 'application/json;charset=UTF-8',
	    		},
	  	},function(error,response,body){
  			if(error) {
    			console.log("error",error);
    			console.log("response",response);
 			}else{
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
	  		},function(error,response,body){
	  	 		if(error) {
	     		   console.log(error);
	      		   //return next(error);
	      		} else {
	        		console.log("request status code >> ",response.statusCode);
	        		//var bodyWithCorrectEncoding = iconv.decode(body, 'UTF-8');
	        		return next(error,response,body);
	      		}
	  		});
    	});
	}



    function getHtmlGzip(searchUrl,timeRequest,next) {

		timeRequestHtml = timeRequest;

    	setTimeout(timeControlCrawler,timeRequestHtml,function(){
    		request({
	    		url: searchUrl, //URL to hit
	      		//qs: {from: 'blog example', time: +new Date()}, //Query string data
	      		method: 'GET', //Specify the method
	      		headers: { //We can define headers too
	      			'Host': 'www.ricardoeletro.com.br',
	        		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:49.0) Gecko/20100101 Firefox/49.0',
	        		'Accept': '*/*',
					'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
					'Accept-Encoding': 'gzip, deflate',
					'X-Requested-With': 'XMLHttpRequest',
					'Connection': 'keep-alive',
					'Content-Length': '0',
					'Referer': 'http://www.ricardoeletro.com.br/Produto/Refrigerador-Geladeira-Electrolux-Frost-Free-2-Portas-380-Litros-Inox-DW42X/256-270-274-85169',
					'Cookie': 'SESSION_1=ieJyNUstu2zAQ%2FBfeZYsviaJOjuICBdLWyKP3NUU7KiTRIOm4SK1%2FL2nJdeqkQHkid2d3Z2bpJE5TItEKrNKNheM3KSRyvq5acA5JKn%2B5ALkAPteodCGMMobjTVxSfydiUQXdDvrnqYhJJERKUTlUpm62ptrvTHernTK9N8dQUUi0xIVIliKjyc1C5MltJVJU3mu%2Ft%2F2Tba%2FZ4cguk%2Bip9U13ms9Dj2fvd3I%2BPxwOM9sosLXRrfbWzJTpZms7vzM%2FYB6oQfJFO0h0chM4mjlhVERukdXiBXoFtbkeyKaBo4CTzH%2BRdjLYOgrnQXhKWR7vRSzu60YZ7VAJUUIjRZZmvCivhpE4LNQ%2BNjtzwZLzJR3tJjwLrIfTJpY%2FlT43ph%2BBKQ%2B7GRpJr%2BKsGOP4bTyMJoQXeWwfB4T34iPa0wuPknF6wt9D86rdEcYfFFYfXUfl2DmaAF5vjW1OWwtf5eRlKH%2FYr9%2Bnhkrvgmtu3%2Fq4FBgXTwMc1IaooiB0zaDQeMM1q5UWxQZvNFV1%2BGxXpuaTqXdGQYvKr6POlYVXE9kRNga%2BQ2vsmS7OpsCD7lbWdKE0gGtJMjoTefHmcMYJJ1mwE1NOuRA4ZYSJlGUi59FqOnV6NB7aT1Z7HXoue2%2F1FhZb3ddQ%2F3GJ8f8AB1tedK8a00c5E998UvQ%2BOQyo%2FA3OuDJg; __utma=241552641.219220223.1474623502.1474976619.1475063461.6; __utmz=241552641.1474976619.5.5.utmcsr=Zanox|utmccn=Refrigerador|utmcmd=CPC_Eletrodomesticos_Zanox|utmcct=Refrigerador_2_Portas; ModalSiteVisualizado=1; __bid=572994d8-6cd3-4185-9e3b-4570eded0397; btg_lastprod={"ids":["508313","96453","311463","402497","671468"]}; __utmc=241552641; PHPSESSID=2b6c774c9449d6d049004df9494b33a8; __sonar=8393549922281295852; BTG360_utms=|so:Zanox|me:CPC_Eletrodomesticos_Zanox|ca:Refrigerador|co:Refrigerador_2_Portas; chaordic_testGroup=%7B%22experiment%22%3A%22RICARDOELETRO_MOTOR_2016_08_09%22%2C%22group%22%3A%22C%22%2C%22testCode%22%3A%22RICARDOELETRO_MOTOR_2016_08_09_C%22%2C%22code%22%3A%22RICARDOELETRO_MOTOR_2016_08_09_C%2FKbZlKTOilh7W6zJ5BtvvqezulRlXPLwr%22%2C%22session%22%3A%22KbZlKTOilh7W6zJ5BtvvqezulRlXPLwr%22%7D; chaordic_browserId=800916b0-849d-11e6-994b-e76390eb9be4; chaordic_anonymousUserId=anon-800916b0-849d-11e6-994b-e76390eb9be4; neemu_sid=ITLCF14YBDVU; prc=8803; Cupom=E198-E863-BA87-DC80; chaordic=%7B%7D; __utmb=241552641.1.10.1475063461; __utmt_UA-1698269-3=1; _mabayaTestMode=1; _mabayaWidgetVeryRef=%22%22', 
	      		},
      			gzip: true,
	      		//encoding: null
	  		},function(error,response,body){
	  	 		if(error) {
	     		   console.log(error);
	      		   //return next(error);
	      		} else {
	      			console.log(body);
	      			//var data = JSON.parse(body);
	      			//console.log(result);

	      			// zlib.gunzip(body,function(error,data) {
          //               if(!error) {
          //                   //response.body = data.toString();
          //                   //var teste = data.toString();
          //       	        return next(error,response,body);
          //               } else {
          //                   console.log('Error unzipping:');
          //                   console.log(error);
          //                   response.body = body;
          //               }
          //           });

	      			//var plain = gunzip.decompress();
	      			//console.log(plain);
	        		//console.log("request status code >> ",response.statusCode);
	        		//var bodyWithCorrectEncoding = iconv.decode(body, 'ISO-8859-1');
	        		//return next(error,response,body);
	      		}
	  		});
    	});
	}


  	function timeControlCrawler(next){
    	console.log("calling to crawler every >> ",timeRequestHtml," miliseconds");
    	next();
  	}


	return {
        getJson: getJson,
        getHtml: getHtml,
        getHtmlGzip: getHtmlGzip,
    };
};


