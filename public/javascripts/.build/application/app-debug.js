define("dist/application/app-debug", [ "./method-debug", "./element-debug", "./template-debug", "./extend-debug", "./effect-debug", "./checkLogin-debug", "./api-debug", "./login-debug", "../cmd-lib/jqueryMd5-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/toast-debug", "../common/bindphone-debug", "../common/baidu-statistics-debug", "./helper-debug" ], function(require, exports, module) {
    var method = require("./method-debug");
    require("./element-debug");
    require("./extend-debug");
    require("./effect-debug");
    require("./login-debug");
    window.template = require("./template-debug");
    require("./helper-debug");
    // 设置访客id-放在此处设置，防止其他地方用到时还未存储到cookie中
    function getVisitUserId() {
        // 访客id-有效时间和name在此处写死
        var name = "visitor_id", expires = 30 * 24 * 60 * 60 * 1e3, visitId = method.getCookie(name);
        // 过有效期-重新请求
        if (!visitId) {
            method.get("http://ishare.iask.sina.com.cn/gateway/user/getVisitorId", function(response) {
                if (response.code == 0 && response.data) {
                    method.setCookieWithExp(name, response.data, expires, "/");
                }
            });
        }
    }
    getVisitUserId();
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
    var bilog = require("../common/bilog-debug");
    //此方法是为了解决外部登录找不到此方法
    window.getCookie = method.getCookie;
    return {
        method: method,
        v: "1.0.1",
        bilog: bilog
    };
});