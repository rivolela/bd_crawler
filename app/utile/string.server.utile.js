String.prototype.removerAcento = function () {
  
  var palavra = this;
  var palavraSemAcento = "";
  var caracterComAcento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
  var caracterSemAcento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";

  for (var i = 0; i < palavra.length; i++)
    {
      var char = palavra.substr(i, 1);
      var indexAcento = caracterComAcento.indexOf(char);
      if (indexAcento != -1) {
        palavraSemAcento += caracterSemAcento.substr(indexAcento, 1);
      } else {
        palavraSemAcento += char;
    }
  }

  return palavraSemAcento;
}



