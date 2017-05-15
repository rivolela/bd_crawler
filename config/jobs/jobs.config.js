module.exports = {

	//schedule reviews job
	all_schedule:'10 17 * * *',
	walmart_schedule:'0 20 * * *',
	ricardo_eletro_schedule:'40 18 * * *',
	lojas_colombo_schedule:'25 17 * * *',
	girafa_schedule:'35 22 * * *',
	nova_schedule:'21 18 * * *',

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