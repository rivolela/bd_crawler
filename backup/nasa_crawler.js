var crawlerjs = require('crawler-js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/crawler-poc');

var Contact = mongoose.model('contact', { 
  nome: String,
  filial: String,
  telefone: String,
});


var crawler = {
  interval: 1000,
  getSample: 'http://science.gsfc.nasa.gov/sed//index.cfm?fuseAction=people.staffList&navOrgCode=600&navTab=nav_about_us&PageNum=1',
  get: 'http://science.gsfc.nasa.gov/sed//index.cfm?fuseAction=people.staffList&navOrgCode=600&navTab=nav_about_us&PageNum=[numbers:1:1000:100]',
  preview: 0,
  extractors: [
    {
      selector: '#border-spacing tr',
      callback: function(err, html){
        if(!err){
          data = {};
          data.nome = html.children('td').eq(0).children('a').text();
          data.filial = html.children('td').eq(3).text();
          data.telefone = html.children('td').eq(4).text();
          var contato = new Contact({ 
            nome: data.nome,
            filial: data.filial,
            telefone: data.telefone
          });

          contato.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('ok');
              }
          });

          //mongoCollection: 'nasa';
          // csv:{
          //   name:'funcionrios-da-nasa.csv'
          // };
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

// var config = {
//   mongoDB : 'crawler-poc',
//   mongoDBHost : 'localhost',
//   mongoDBPort: '27017'

// }

crawlerjs(crawler);






