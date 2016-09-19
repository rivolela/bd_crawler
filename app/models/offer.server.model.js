var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OfferSchema = new Schema({
	name: {
    type:String,
    trim: true,
  },
  ean: Number,
  category: String,
  merchantProductId: String,
  manufacturer:String,
  url: String,
  advertiser: String,
  created:{
    type:Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Offer', OfferSchema);


//mongoose.model('Offer',OfferSchema);