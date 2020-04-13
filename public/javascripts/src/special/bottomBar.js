define(function(require , exports , module){
    console.log('专题的bottomBar')
    var method = require("../application/method");
    var login = require("../application/checkLogin");
   // 收藏与取消收藏功能
   $('.search-img-box .ic-collect').click(function(){
       console.log('专题收藏')
       if(!method.getCookie('cuk')){
           console.log('用户未登录')
           login.notifyLoginInterface(function (data) {
           console.log('-------------------')
           fileSaveOrupdate()
          
        })
       }else{
        fileSaveOrupdate()
       }
   })



   // 收藏或取消收藏接口
   function fileSaveOrupdate(fid,uid,source,channel) {
    $.ajax({
        url: api.comment.fileSaveOrupdate,
        type: "POST",
        data: JSON.stringify({ fid:fid,uid:uid,source:0,channel:0 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (res) {
            if(res.code === 0){
                $.toast({
                    text: "收藏成功"
                })
            }else{
                $.toast({
                    text: "收藏失败"
                })
            }
        }
    })
}
});