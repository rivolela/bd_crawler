module.exports = {
	// Development configuration options
	db:'mongodb://127.0.0.1:27017/pickoout_dev',
	sessionSecret:'developmentSessionSecret',
	connectid:'43EEF0445509C7205827',
	timeRequest:2000,
	// Crawler Options 
	// programs ids
	// 12011 : Walmart BR"
	// 13212 : Ricardo Eletro BR
	// 16588 : Lojas Colombo BR
	programs:'12011,13212,16588',
	query:'geladeira',
	// schedule offers jobs
	zanox_schedule:'55 11 * * *',
	//schedule reviews jobs
	ricardo_eletro_schedule:'34 11 * * *',
	walmart_schedule:'35 11 * * *',
	lojas_colombo_schedule:'30 18 * * *'
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