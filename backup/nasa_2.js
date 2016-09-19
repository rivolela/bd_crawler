var crawlerjs = require('crawler-js');

var crawler = {
  interval: 1,
  getSample: 'http://science.gsfc.nasa.gov/sed//index.cfm?fuseAction=people.staffList&navOrgCode=600&navTab=nav_about_us&PageNum=1',
  get: 'http://science.gsfc.nasa.gov/sed//index.cfm?fuseAction=people.staffList&navOrgCode=600&navTab=nav_about_us&PageNum=[numbers:1:100:10]',
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
          console.log(data);
        }else{
          console.log(err);
        }
      }
    }
  ]
}

crawlerjs(crawler);

