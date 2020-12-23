

define(function (require, exports, module){
   var pageConfig = window.pageConfig&&window.pageConfig
    var isConvert = pageConfig&&pageConfig.page.isConvert
    var method = require("../application/method");
    var api = require('../application/api');
    var guessYouLike = require('./template/guessYouLike.html')
   var userId = method.getCookie('userId')?method.getCookie('userId'):method.getCookie('visitor_id')
   var requestId = Math.random().toString().slice(-10);// requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串
   window.recommendConfig = {}   // 第四范式参数 在上报时需要
   var params = {
    request:{ "userId": userId, "requestId": requestId }
 }

 
 $ajax(api.recommend.recommendConfigInfo,'post',['ishare_personality']).then(function(recommendConfig){
    if(recommendConfig.code == '200'){
      var sceneID = recommendConfig.data[0].useId 
      window.recommendConfig =  recommendConfig.data
     $ajax(api.tianshu['4paradigm'].replace(/\$sceneID/, sceneID),'POST',params).then(function(res){
         if(res.code == '200'){
          window.paradigm4 = {
            paradigm4Guess:res.data
          }
          
          var paradigm4GuessData = []
          $.each(list.data,function(index,item){
              paradigm4GuessData.push({
                  id: item.itemId || '',
                  format: item.categoryLevel5 ||'',
                  name: item.title || '',
                  cover_url: item.coverUrl || '',
                  url: item.url || '',
                  item_read_cnt: item.item_read_cnt
              })
          })
             var guessYouLikeTemplate =  template.compile(guessYouLike)({paradigm4GuessData:res.data});
             console.log('guessYouLikeTemplate:',guessYouLikeTemplate)
             $('.guess-you-like-warpper').html(guessYouLikeTemplate)
             
         var guessYouLikeHeight = $('.guess-you-like-warpper').outerHeight(true) || 0
         var userEvaluation = $('.user-comments-container').outerHeight(true) || 0
        var currentPage = $('.detail-con').length
        var temp = guessYouLikeHeight + userEvaluation +30
        var bottomHeight =  (currentPage == 1||currentPage == 2)?temp+123:temp
        $('.detail-footer').css({
          'position': 'absolute',
          'left':'0px',
          'right':'0px',
          'bottom':(bottomHeight) + 'px',
          'width': '890px'
      })
      
    }
         
     })
    }
 }) 
 
    
})