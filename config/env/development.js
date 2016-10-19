module.exports = {
	// Development configuration options
	db:'mongodb://127.0.0.1:27017/bd_dev',
	sessionSecret:'developmentSessionSecret',
	connectid:'43EEF0445509C7205827',
	timeRequest:4000,
	// Crawler Options 
	// programs ids
	// 12011 : Walmart BR"
	// 13212 : Ricardo Eletro BR
	// 16588 : Lojas Colombo BR
	programs:'13212,16588',
	query:'ventilador',

	// schedule offers jobs
	zanox_schedule:'6 13 * * *',

	//schedule reviews job
	walmart_schedule:'35 11 * * *',
	ricardo_eletro_schedule:'3 13 * * *',
	lojas_colombo_schedule:'12 13 * * *',

	// urls crawler
	ricardo_eletro_url: 'http://www.ricardoeletro.com.br/Produto/',
	lojas_colombo: 'https://www.colombo.com.br'
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