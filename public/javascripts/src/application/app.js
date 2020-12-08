define(function (require, exports, module) {
    var method = require("./method");
    var urlConfig=require('./urlConfig');
    var api = require("./api");
    new ISHARE_WEB_SDK({  //埋点初始化
        PRODUCT_CONFIG:{
            TERMINAL_TYPE: '0',        // 终端类型
            PRODUCT_NAME: 'ishare',    // 产品名称
            SITE_TYPE: 'ishare',       // 站点类型
            PRODUCT_CODE: '0',         // 产品代码
            PRODUCT_VER: 'V1.0.0',     // 产品版本
        },
        TRACK_TYPE:'get',//请求方式post get(目前m端是post,pc端是get)
        TRACK_URL:urlConfig.bilogUrl   //上报服务器地址
    })
    getVisitUserId();


    
    require("./element");
    require("./extend");
    require('./effect.js')
    require('./login')
    window.template = require("./template");
    require("./helper");
    
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
            visitId = method.getCookie(name),
            sdk_token = 'iask_web';
            iask_web.init(sdk_token,{
                local_storage:{
                    type: 'localStorage'
                },
                loaded:function(sdk){
                      // 过有效期-重新请求
                     if (!visitId) {
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
                                    sdk.set_visit_id(res.data); //设置visitID
                                } else {
                                    visitId = (Math.floor(Math.random() * 100000) + new Date().getTime() + '000000000000000000').substring(0, 18)
                                    sdk.set_visit_id(visitId); //设置visitID
                                }
                            },
                            error: function (error) {
                                console.log('getVisitUserId:', error)
                                visitId = (Math.floor(Math.random() * 100000) + new Date().getTime() + '000000000000000000').substring(0, 18)
                                method.setCookieWithExp(name, visitId, expires, '/');
                                sdk.set_visit_id(visitId); //设置visitID
                            }
                        })
                   }else{
                    sdk.set_visit_id(visitId); //设置visitID
                   }
                }
            })
    }

    

    $.ajaxSetup({
        headers: {
            'Authrization': method.getCookie('cuk')
        },
        complete: function (XMLHttpRequest, textStatus) {
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

    
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1"
    }
});