

define(function (require, exports, module){
   
  var paradigm4Report = require('../common/paradigm4-report')
  var method = require("../application/method");
  var api = require('../application/api');
  var guessYouLike = require('./template/guessYouLike.html')
 var userId = method.getCookie('userId')?method.getCookie('userId'):method.getCookie('visitor_id')
 var requestId = Math.random().toString().slice(-10);// requestID是用来标注推荐服务请求的ID，是长度范围在8~18位的随机字符串

 var params = {
  request:{ "userId": userId, "requestId": requestId }
}


$ajax(api.recommend.recommendConfigInfo,'post',['ishare_personality']).then(function(recommendConfig){
  if(recommendConfig.code == '0'){
    var sceneID = recommendConfig.data[0].useId 
    var paradigm4GuessRecommendConfig =  $.extend({},recommendConfig.data[0],{requestId:requestId})
   $ajax(api.tianshu['4paradigm'].replace(/\$sceneID/, sceneID),'POST',params).then(function(res){
       if(res.code == '200'){
        window.paradigm4Data = {
          paradigm4Guess:res.data
        }
        
        var paradigm4GuessData = []
        $.each(res.data,function(index,item){
            paradigm4GuessData.push({
                id: item.itemId || '',
                format: item.categoryLevel5 ||'',
                name: item.title || '',
                cover_url: item.coverUrl || '',
                url: item.url || '',
                item_read_cnt: item.item_read_cnt,
                context:item.context
            })
        })
           var guessYouLikeTemplate =  template.compile(guessYouLike)({paradigm4GuessData:paradigm4GuessData.slice(0,4)});
          
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
    action(paradigm4GuessData,paradigm4GuessRecommendConfig)   
   })
  }
}) 

 


function action(paradigm4GuessData,paradigm4GuessRecommendConfig) {
     
var paradigm4 = window.paradigm4 || {};
var paradigm4GuessData = paradigm4GuessData
var paradigm4GuessRecommendConfig = paradigm4GuessRecommendConfig
var paradigm4Relevant = paradigm4.paradigm4Relevant&&paradigm4.paradigm4Relevant.data || []; // 第四范式相关推荐
var relevantRecommendInfoData = paradigm4.relevantRecommendInfoData&&paradigm4.relevantRecommendInfoData.data[0] || {}



if(paradigm4Relevant.length){
  paradigm4Report.pageView(paradigm4Relevant,relevantRecommendInfoData)
}
if(paradigm4GuessData.length){
  paradigm4Report.pageView(paradigm4GuessData,paradigm4GuessRecommendConfig)
}


//猜你喜欢点击
$(document).on('click','.guess-you-like .item',function(){
    var itemId = $(this).data('id') || '';
    paradigm4Report.eventReport(itemId,paradigm4GuessData,paradigm4GuessRecommendConfig)
})


//相关推荐点击
$(document).on('click','.related-data-list li',function(){
    var itemId = $(this).data('id') || '';
    paradigm4Report.eventReport(itemId,paradigm4Relevant,relevantRecommendInfoData)
})

}   

})