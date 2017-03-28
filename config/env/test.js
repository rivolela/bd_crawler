module.exports = {
// Development configuration options
	db:'mongodb://127.0.0.1:27017/bd_test',
	sessionSecret:'testSessionSecret',
	connectid:'43EEF0445509C7205827',
	timeRequest:1000,
	productPageTest:'http://localhost:3000/ricardo_eletro.html',

	// proxy vpn secure
	proxyAuth:'rivolela:Rovel@1976',
	proxyUrl:'proxy-br1.vpnsecure.me:8080',
	proxy:'http://rivolela:Rovel@1976@proxy-br1.vpnsecure.me:8080',

	// urls crawler
	ricardo_eletro_url: 'http://www.ricardoeletro.com.br/Produto/',
	lojas_colombo: 'https://www.colombo.com.br',
	walmart_url: 'https://www.walmart.com.br/item/',
	ponto_frio_url: 'http://www.pontofrio.com.br/',
	girafa_url: 'http://www.girafa.com.br/'
};

