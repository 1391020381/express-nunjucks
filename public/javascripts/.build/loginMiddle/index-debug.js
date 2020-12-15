define("dist/loginMiddle/index-debug", [ "../application/api-debug", "../application/urlConfig-debug", "../application/method-debug" ], function(require, exports, module) {
    // 登录 第三方授权回调页面
    var api = require("../application/api-debug");
    var method = require("../application/method-debug");
    var redirectUrl = method.getParam("redirectUrl");
    var code = method.getParam("code");
    var channel = method.getParam("channel");
    // 使用渠道：1:登录；2:绑定
    var clientCode = method.getParam("clientCode");
    var jsId = method.getLoginSessionId();
    thirdLoginRedirect(code, channel, clientCode);
    function thirdLoginRedirect(code, channel, clientCode) {
        // 根据授权code 获取 access_token
        $.ajax({
            headers: {
                jsId: jsId
            },
            url: api.user.thirdLoginRedirect,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                terminal: "0",
                thirdType: clientCode,
                code: code,
                businessSys: "ishare"
            }),
            dataType: "json",
            success: function(res) {
                if (res.code == "0") {
                    window.loginType = clientCode;
                    // 获取用户信息时埋点需要
                    method.setCookieWithExpPath("cuk", res.data.access_token, res.data.expires_in * 1e3, "/");
                    method.setCookieWithExpPath("loginType", loginType, res.data.expires_in * 1e3, "/");
                    $.ajaxSetup({
                        headers: {
                            Authrization: method.getCookie("cuk")
                        }
                    });
                    window.open(redirectUrl, "_self");
                } else {
                    window.open(redirectUrl, "_self");
                }
            },
            error: function(error) {
                $.toast({
                    text: res.message,
                    delay: 3e3
                });
            }
        });
    }
});