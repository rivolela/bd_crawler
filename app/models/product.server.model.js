var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var uniqueValidator = require('mongoose-unique-validator');

var ProductSchema = new Schema({
  name: {
    type:String,
    trim: true,
  },
  ean: {
    type:Number,
  },
  image: String,
  // category: {
  //   type:String,
  //   index: true 
  // },
  // merchantProductId: String,
  manufacturer:{
    type:String,
  },
  // advertiser: String,
  created:{
    type:Date,
    default: Date.now
  },
  countSad: Number,
  countHappy: Number,
  totalReviews: Number,
  departamentBD: String,
  updated:{
    type:Date,
    default: Date.now
  },
  nameURL: {
    type:String,
  },
});

// ProductSchema.plugin(uniqueValidator,{ type:'ean-unique-validator'});

module.exports = mongoose.model('Product', ProductSchema);


