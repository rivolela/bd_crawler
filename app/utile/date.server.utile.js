module.exports = function(){

	function getJobTime(time_start,next){
   		var time_end = new Date();
  		var totalHours = time_end.getHours() - time_start.getHours();
  		var totalMinutes = time_end.getMinutes() - time_start.getMinutes();
  		console.log("\n");
  		console.log("total job time  >> " + totalHours + " hour(s) and " + totalMinutes + " minute(s)");
    	next();
  	}

return {
	getJobTime:getJobTime

    };

};

