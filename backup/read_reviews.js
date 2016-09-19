var parsedJSON = require('./result.json');
var flatten = require('flat');

var jsonfile = require('jsonfile');
var file = './result.js';

jsonfile.readFile(file, function(err, obj) {
  console.dir(obj)
})

//function saveReviews(data){
//var info = JSON.stringify(parsedJSON);
//
//    flatten(info),{ 
// 	   		maxDepth: 10 
// 	   	};

//   var i=0;
  console.log(parsedJSON);
  // for (var key in parsedJSON) {
  //     value = parsedJSON[key];
  //     console.log(i,data.title);
  //     console.log(i,data.description);
  //     console.log(i,data.author);
  //     console.log(i,data.location);
  //     console.log(i,data.date);
  //     console.log(i,data.rating);
  //     i = i+1;
 // }
//;
