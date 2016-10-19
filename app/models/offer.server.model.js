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
  url: {
    type:String,
  },
  urlOffer: String,
  advertiser: String,
  created:{
    type:Date,
    default: Date.now
  },
});

// middleware to handle attributes before to save
OfferSchema.pre('save',function(next){
  
  // split merchant url offer thal will be used in crawler
  var url_01 = this.url.split('[[');
  console.log(url_01);
  var url_02 = url_01[1].split('?');
  console.log(url_02);

  this.urlOffer = url_02[0];
  
  next();
});


module.exports = mongoose.model('Offer', OfferSchema);


//mongoose.model('Offer',OfferSchema);