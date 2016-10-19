request({
    url: searchUrl, //URL to hit
    //qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'GET', //Specify the method
    headers: { //We can define headers too
        'User-Agent': 'request',
        'Content-Type': 'text/html',
    },
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10,
    },function(error,response,body){
    if(error) {
       console.log(error);

       if (error.message.code === 'ETIMEDOUT'){
        getHtml(searchUrl,config.timeRequest,next);
       };
       //return next(error);
    } else {
        console.log("request status code >> ",response.statusCode);
        //var bodyWithCorrectEncoding = iconv.decode(body, 'UTF-8');
        return next(error,response,body);
    }
    });