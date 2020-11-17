define(function (require, exports, module) {
    var method = require("./method");
    require("./element");
    require("./extend");
  require('./effect.js')
  require('./login')
    window.template = require("./template");
    require("./helper");
    var api = require("./api");

    // 设置访客id-放在此处设置，防止其他地方用到时还未存储到cookie中
    function getVisitUserId() {
        // 访客id-有效时间和name在此处写死
        var name = 'visitor_id',
            expires = 30 * 24 * 60 * 60 * 1000,
            visitId = method.getCookie(name);
        // 过有效期-重新请求
        if (!visitId) {
            // method.get(api.user.getVisitorId, function (response) {
            //     if (response.code == 0 && response.data) {
            //         method.setCookieWithExp(name, response.data, expires, '/');
            //     }else{
            //        visitId =  (Math.floor(Math.random()*100000) + new Date().getTime() + '000000000000000000').substring(0, 18) 
            //     }
            // })
            $.ajax({
                headers:{
                    'Authrization':method.getCookie('cuk')
                },
                url: api.user.getVisitorId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (res) {
                   if(res.code == '0'){
                    method.setCookieWithExp(name, res.data, expires, '/');
                   }else{
                    visitId =  (Math.floor(Math.random()*100000) + new Date().getTime() + '000000000000000000').substring(0, 18) 
                   }
                },
                error:function(error){
                    console.log('getVisitUserId:',error)
                    visitId =  (Math.floor(Math.random()*100000) + new Date().getTime() + '000000000000000000').substring(0, 18) 
                    method.setCookieWithExp(name, visitId, expires, '/');
                }
            })
            
        }
    }
    getVisitUserId();

    $.ajaxSetup({
        headers:{
            'Authrization':method.getCookie('cuk')
        },
        complete:function(XMLHttpRequest,textStatus){
        },
        statusCode: {
            401: function() { 
                method.delCookie("cuk", "/");
                $.toast({
                    text:'请重新登录',
                    delay : 2000
                })
            }
        }
     });
     
    var bilog=require("../common/bilog");
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1",
        bilog:bilog
    }
});