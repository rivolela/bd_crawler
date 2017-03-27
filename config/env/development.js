module.exports = {

	// Development configuration options
	db:'mongodb://teste1:teste1234@ds145138.mlab.com:45138/heroku_l4pp17t7',
	sessionSecret:'developmentSessionSecret',
	connectid:'43EEF0445509C7205827',
	timeRequest:1000,

	// proxy vpn secure
	proxyAuth:'rivolela:Rovel@1976',
	proxyUrl:'proxy-br1.vpnsecure.me:8080',
	proxy:'http://rivolela:Rovel@1976@proxy-br1.vpnsecure.me:8080',

	//schedule reviews job
	walmart_schedule:'14 11 * * *',
	ricardo_eletro_schedule:'1 11 * * *',
	lojas_colombo_schedule:'12 10 * * *',
	ponto_frio_schedule:'2 16 * * *',

	// urls crawler
	ricardo_eletro_url: 'http://www.ricardoeletro.com.br/Produto/',
	lojas_colombo: 'https://www.colombo.com.br',
	walmart_url: 'https://www.walmart.com.br/item/',
	ponto_frio_url: 'http://www.pontofrio.com.br/'
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