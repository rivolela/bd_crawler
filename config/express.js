var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
 	bodyParser = require('body-parser'),
 	cookieSession = require('cookie-session'),
	methodOverride = require('method-override');

module.exports = function () {
	
	var app = express();

	if(process.env.NODE_ENV === 'development'){
		app.use(morgan('dev'));
	}else if(process.env.NODE_ENV === 'production'){
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(cookieSession({
		name: 'session',
		secret:config.sessionSecret
	}));


	app.use(function (req, res, next) {
  		// Update views 
  		req.session.views = (req.session.views || 0) + 1;
 
  		// Write response 
  		res.end(req.session.views + ' views');
	});
 
	require('../app/routes/zanox.server.routes.js')(app);
	require('../app/routes/walmart.server.routes.js')(app);

	return app;
};


