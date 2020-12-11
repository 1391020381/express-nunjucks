define("dist/application/app-debug", [ "./method-debug", "./urlConfig-debug", "./api-debug", "./loadSentry-debug", "./element-debug", "./template-debug", "./extend-debug", "./effect-debug", "./checkLogin-debug", "./login-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "./iframe/iframe-messenger-debug", "./iframe/messenger-debug", "../common/baidu-statistics-debug", "../common/loginType-debug", "./helper-debug", "./single-login-debug" ], function(require, exports, module) {
    var method = require("./method-debug");
    var urlConfig = require("./urlConfig-debug");
    var api = require("./api-debug");
    require("./loadSentry-debug");
    window.$ajax = $ajax;
    new ISHARE_WEB_SDK({
        //埋点初始化
        PRODUCT_CONFIG: {
            TERMINAL_TYPE: "0",
            // 终端类型
            PRODUCT_NAME: "ishare",
            // 产品名称
            SITE_TYPE: "ishare",
            // 站点类型
            PRODUCT_CODE: "0",
            // 产品代码
            PRODUCT_VER: "V1.0.0"
        },
        TRACK_TYPE: "get",
        //请求方式post get(目前m端是post,pc端是get)
        TRACK_URL: urlConfig.bilogUrl,
        //上报服务器地址
        PAGEVIEW: true
    });
    getVisitUserId();
    require("./element-debug");
    require("./extend-debug");
    require("./effect-debug");
    require("./login-debug");
    window.template = require("./template-debug");
    require("./helper-debug");
    var singleLogin = require("./single-login-debug").init;
    var url = api.user.dictionaryData.replace("$code", "singleLogin");
    $ajax(url, "GET", "", false).done(function(res) {
        if (res.code == 0 && res.data && res.data.length) {
            var item = res.data[0];
            if (item.pcode == 1) {
                singleLogin();
            }
        }
    });
    // 设置访客id-放在此处设置，防止其他地方用到时还未存储到cookie中
    function getVisitUserId() {
        // 访客id-有效时间和name在此处写死
        var name = "visitor_id", expires = 30 * 24 * 60 * 60 * 1e3, visitId = method.getCookie(name), sdk_token = "iask_web";
        iask_web.init(sdk_token, {
            local_storage: {
                type: "localStorage"
            },
            loaded: function(sdk) {
                // 过有效期-重新请求
                if (!visitId) {
                    $ajax(api.user.getVisitorId, "GET").done(function(res) {
                        if (res.code == "0") {
                            method.setCookieWithExp(name, res.data, expires, "/");
                            sdk.set_visit_id(res.data);
                        } else {
                            visitId = (Math.floor(Math.random() * 1e5) + new Date().getTime() + "000000000000000000").substring(0, 18);
                            sdk.set_visit_id(visitId);
                        }
                    }).fail(function() {
                        console.log("getVisitUserId:", error);
                        visitId = (Math.floor(Math.random() * 1e5) + new Date().getTime() + "000000000000000000").substring(0, 18);
                        method.setCookieWithExp(name, visitId, expires, "/");
                        sdk.set_visit_id(visitId);
                    });
                } else {
                    sdk.set_visit_id(visitId);
                }
            }
        });
    }
    // 全局的ajax 请求方法
    function $ajax(url, ajaxMethod, data, async) {
        //  .done(function(){})  .fail(function(){})
        return $.ajax(url, {
            type: ajaxMethod || "post",
            data: data ? JSON.stringify(data) : "",
            async: async == undefined ? true : false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "cache-control": "no-cache",
                Pragma: "no-cache",
                Authrization: method.getCookie("cuk")
            }
        });
    }
    $.ajaxSetup({
        headers: {
            Authrization: method.getCookie("cuk")
        },
        complete: function(XMLHttpRequest, textStatus) {},
        statusCode: {
            401: function() {
                method.delCookie("cuk", "/");
                $.toast({
                    text: "请重新登录",
                    delay: 2e3
                });
            }
        }
    });
    $(document).ready(function() {
        $(document).ajaxError(function(event, xhr, options, exc) {
            console.log(JSON.stringify({
                event: event,
                xhr: xhr,
                options: options,
                exc: exc
            }));
            Sentry.captureException(JSON.stringify({
                event: event,
                xhr: xhr,
                options: options,
                exc: exc
            }));
        });
    });
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1"
    };
});