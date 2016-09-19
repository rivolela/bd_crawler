var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function(){
	var db = mongoose.connect(config.db);
	require('../app/models/offer.server.model');
	require('../app/models/review.server.model');
	return db;
}


