define(function (require, exports, module) {
    var method = require("./method");
    require("./element");
    require("./extend");
    window.$ajax  =  $ajax
    require('./effect.js')
    require('./login')
    window.template = require("./template");
    require("./helper");
    var api = require("./api");
    var singleLogin = require('./single-login').init
    var url = api.user.dictionaryData.replace('$code', 'singleLogin');
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (res) {
            console.log(res)
            if (res.code == 0 && res.data && res.data.length) {
                var item = res.data[0];
                if (item.pcode == 1) {
                    singleLogin()
                }
            }
        }
    })

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
            //        visitId =  (Math.floor(Math.random()*100000) + new Date().getTime() +
            // '000000000000000000').substring(0, 18)  } })
            $.ajax({
                headers: {
                    'Authrization': method.getCookie('cuk')
                },
                url: api.user.getVisitorId,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (res) {
                    if (res.code == '0') {
                        method.setCookieWithExp(name, res.data, expires, '/');
                    } else {
                        visitId = (Math.floor(Math.random() * 100000) + new Date().getTime() + '000000000000000000').substring(0, 18)
                    }
                },
                error: function (error) {
                    console.log('getVisitUserId:', error)
                    visitId = (Math.floor(Math.random() * 100000) + new Date().getTime() + '000000000000000000').substring(0, 18)
                    method.setCookieWithExp(name, visitId, expires, '/');
                }
            })

        }
    }

    getVisitUserId();


function $ajax(url,ajaxMethod,data,async,customHeaders){  //  .done(function(){})  .fail(function(){})
    return  $.ajax(url, {
      type: ajaxMethod || "post",
      data: data?JSON.stringify(data):'',
      async:(async == undefined||async == '') ?true:false,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      headers: $.extend({},{
          'cache-control': 'no-cache',
          'Pragma': 'no-cache',
          'Authrization':method.getCookie('cuk')
      },customHeaders)
  })
}


    $.ajaxSetup({
        headers: {
            'Authrization': method.getCookie('cuk')
        },
        complete: function (XMLHttpRequest, textStatus) {
            // console.log('ajaxSetup:',XMLHttpRequest, textStatus)
        },
        statusCode: {
            401: function () {
                method.delCookie("cuk", "/");
                $.toast({
                    text: '请重新登录',
                    delay: 2000
                })
            }
        }
    });

    var bilog = require("../common/bilog");
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1",
        bilog: bilog
    }
});