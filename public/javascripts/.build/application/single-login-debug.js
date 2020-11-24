define("dist/application/single-login-debug", [ "./method-debug", "./api-debug", "./urlConfig-debug" ], function(require) {
    var method = require("./method-debug");
    var api = require("./api-debug");
    // 根据环境读取登录页url
    var javaPath = loginUrl + "/login-common.html?redirectUrl=";
    // 获取参数中字段
    function getParamsByUrl(href, name) {
        href = href || "";
        var strArr = href.split(name);
        var jsCode = strArr[1];
        if (jsCode) {
            // 优先截取& 其次截取#
            strArr = jsCode.split("&");
            jsCode = strArr[0];
            strArr = jsCode.split("#");
            jsCode = strArr[0];
            jsCode = jsCode.split("=")[1] || "";
        } else {
            jsCode = "";
        }
        return jsCode;
    }
    // 携带数据时，链接上已存在相关字段，进行去重处理
    function duplicateToUrl(href, name1, name2) {
        var hasIt = false;
        var val = "";
        if (href.match(name1)) {
            hasIt = true;
            val = getParamsByUrl(href, name1);
            href = href.replace(name2 + val, "");
        }
        return {
            originUrl: href,
            hasIt: hasIt,
            val: val
        };
    }
    // 通过每次进中间页读取cookie获取登录态
    function init() {
        var loginSessionId = method.getLoginSessionId();
        if (loginSessionId) {
            // 调取接口-获取token
            updateLoginToken(loginSessionId);
        } else {
            var href = window.location.href;
            var localRedtId = method.getCookie("ish_redirect");
            var redtObj = duplicateToUrl(href, "ish_redtid", "#ish_redtid=");
            // 此种方式-通过在cookie中存储跳转标识，但不保证当次一定为重定向回传过来
            // 添加时间戳或者唯一标识，通过返回的url是否携带标识来判断是否是对应触发返回
            if (localRedtId && localRedtId === redtObj.val) {
                // 重定向回传触发
                method.delCookie("ish_redirect", "/");
                var jsId = getParamsByUrl(href, "ishare_jssid");
                if (jsId) {
                    method.saveLoginSessionId(jsId);
                    // 调取接口-获取token
                    updateLoginToken(jsId);
                }
            } else {
                var redtid = method.randomString(6);
                // 保存重定向触发标识保存半小时
                method.setCookieWithExpPath("ish_redirect", redtid, 18e5, "/");
                var params = encodeURIComponent(redtObj.originUrl + "#ish_redtid=" + redtid);
                window.location.href = javaPath + params;
            }
        }
    }
    // 获取并且更新token
    function updateLoginToken(jsId) {
        $.ajax({
            url: api.user.checkSso,
            type: "GET",
            async: false,
            headers: {
                "cache-control": "no-cache",
                Pragma: "no-cache",
                jsId: jsId
            },
            cache: false,
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(res) {
                console.log(res);
                if (res.code == "0" && res.data && res.data.access_token) {
                    method.saveLoginToken(res.data.access_token);
                } else {
                    method.delLoginToken();
                }
            }
        });
    }
    return {
        init: init
    };
});