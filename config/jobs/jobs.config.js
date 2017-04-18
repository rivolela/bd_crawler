module.exports = {

	//schedule reviews job
	all_schedule:'00 21 * * *',
	walmart_schedule:'0 20 * * *',
	ricardo_eletro_schedule:'40 18 * * *',
	lojas_colombo_schedule:'25 17 * * *',
	ponto_frio_schedule:'55 17 * * *',
	girafa_schedule:'35 22 * * *',
	extra_schedule:'35 17 * * *',
	casas_bahia_schedule:'21 18 * * *',

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