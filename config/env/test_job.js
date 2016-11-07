module.exports = {
	// Development configuration options
	db:'mongodb://127.0.0.1:27017/bd_test_job',
	sessionSecret:'developmentSessionSecret',
	connectid:'43EEF0445509C7205827',
	timeRequest:2000,

	//schedule reviews jobs
	ricardo_eletro_schedule:'34 11 * * *',
	walmart_schedule:'35 11 * * *',
	lojas_colombo_schedule:'59 11 * * *',

	// urls crawler
	ricardo_eletro_url: 'http://www.ricardoeletro.com.br/Produto/',
	lojas_colombo: 'https://www.colombo.com.br',
	walmart_url: 'https://www.walmart.com.br/item/'
};
