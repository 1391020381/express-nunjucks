define(function(require , exports , module){
   var mycollectionAndDownLoad = require('./template/mycollectionAndDownLoad.html')
   var _mycollectionAndDownLoadTemplate = template.compile(mycollectionAndDownLoad)({});
   var type = window.pageConfig&&window.pageConfig.page.type
   if(type =='mycollection'){
      $(".personal-center-mycollection").html(_mycollectionAndDownLoadTemplate);
   }else{
      $(".personal-center-mydownloads").html(_mycollectionAndDownLoadTemplate);
   }
  
});