module.exports = {
// Development configuration options
	db:'mongodb://127.0.0.1:27017/pickoout_test',
	sessionSecret:'testSessionSecret',
	connectid:'43EEF0445509C7205827',
	timeRequest:3000,
	productPageTest:'http://localhost:3000/ricardo_eletro.html',
	// programs ids
	// 12011 : Walmart BR"
	// 13212 : Ricardo Eletro BR
	// 16588 : Lojas Colombo BR
	programs:'12011,13212,16588',
	query:'fogao',

	// schedule jobs
	zanox_schedule:'2 14 * * *',
	ricardo_eletro_schedule:'35 16 * * *',
	walmart_schedule:'53 11 * * *',
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