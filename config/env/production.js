module.exports = {
// Development configuration options
	db:'mongodb://bdeciding:rovel1954@ds035776.mlab.com:35776/heroku_5lt8spw4',
	sessionSecret:'productSessionSecret',
	connectid:'43EEF0445509C7205827',
	timeRequest:3000,
	// programs ids
	// 12011 : Walmart BR"
	// 13212 : Ricardo Eletro BR
	// 16588 : Lojas Colombo BR
	programs:'12011,13212,16588',
	query:'geladeira',

	// schedule jobs
	zanox_schedule:'0 8 * * *',
	ricardo_eletro_schedule:'0 13 * * *',
	walmart_schedule:'0 14 * * *',
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