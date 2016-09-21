var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function(){

		//var uristring = config.db;
		var uristring = config.db;

		var db = mongoose.connect(uristring,function(err, res){
			 if (err) {
      			console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      		} else {
      			//console.log ('Succeeded connected to: ' + uristring);
      			console.log ('Succeeded connected');
      			require('../app/models/offer.server.model');
				require('../app/models/review.server.model');
      		}
		});
		
		return db;
};


