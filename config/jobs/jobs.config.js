module.exports = {

	//schedule reviews job
	walmart_schedule:'0 17 * * *',
	ricardo_eletro_schedule:'0 18 * * *',
	lojas_colombo_schedule:'0 19 * * *',
	ponto_frio_schedule:'0 20 * * *',
	girafa_schedule:'0 21 * * *',

};


// var task = cron.schedule('* * * * *', function() {
//   console.log('immediately started');
// }, true);

// task.start()

 // # ┌────────────── second (optional)
 // # │ ┌──────────── minute
 // # │ │ ┌────────── hour
 // # │ │ │ ┌──────── day of month
 // # │ │ │ │ ┌────── month
 // # │ │ │ │ │ ┌──── day of week
 // # │ │ │ │ │ │
 // # │ │ │ │ │ │
 // # * * * * * *