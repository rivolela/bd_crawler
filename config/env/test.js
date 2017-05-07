module.exports = {
// Development configuration options
	db:'mongodb://127.0.0.1:27017/bd_test',
	sessionSecret:'testSessionSecret',
	connectid:'A3697E2455EA755B758F',
	timeRequest:1000,
	productPageTest:'http://localhost:3000/ricardo_eletro.html',

	// proxy vpn secure
	proxyAuth:'rivolela:Rovel@1976',
	proxyUrl:'proxy-br1.vpnsecure.me:8080',
	proxy:'http://rivolela:Rovel@1976@proxy-br1.vpnsecure.me:8080',

	// services
	bdService: "https://bd-services-test.herokuapp.com/api/",
	bdProductSrv: "https://da-product-srv-test.herokuapp.com/api/",
};

