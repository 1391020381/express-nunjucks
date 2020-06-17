define(function(require , exports , module){
   var mycollectionAndDownLoad = require('./template/mycollectionAndDownLoad.html')
   var type = window.pageConfig&&window.pageConfig.page.type
   if(type =='mycollection'){
      var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({type:'mycollection'});
      $(".personal-center-mycollection").html(_mycollectionAndDownLoadTemplate);
   }else{
      var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({type:'mydownloads'});
      $(".personal-center-mydownloads").html(_mycollectionAndDownLoadTemplate);
   }
  
});