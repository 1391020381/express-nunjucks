define(function (require, exports, module) {
    var method = require("./method");
    require("./element");
    require("./extend");
   // require('../report/init');
  require('./effect.js')
  require('./login')
    window.template = require("./template");
    require("./helper");
    require('//static3.iask.cn/resource/js/plugins/pc.iask.login.min.js');

    // 设置访客id-放在此处设置，防止其他地方用到时还未存储到cookie中
    function getVisitUserId() {
        // 访客id-有效时间和name在此处写死
        var name = 'visitor_id',
            expires = 30 * 24 * 60 * 60 * 1000,
            visitId = method.getCookie(name);
        // 过有效期-重新请求
        if (!visitId) {
            method.get('/gateway/user/getVisitorId', function (response) {
                if (response.code == 0 && response.data) {
                    method.setCookieWithExp(name, response.data, expires, '/');
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