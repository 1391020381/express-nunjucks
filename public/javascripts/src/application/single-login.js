define(function (require) {
    var method = require("./method");
    var api = require("./api");
    // 根据环境读取登录页url
    var javaPath = loginUrl + '/login-common.html?redirectUrl=';

    // 获取参数中字段
    function getParamsByUrl(href, name) {
        href = href || '';
        var strArr = href.split(name);
        var jsCode = strArr[1];
        if (jsCode) {
            // 优先截取& 其次截取#
            strArr = jsCode.split('&');
            jsCode = strArr[0];
            strArr = jsCode.split('#');
            jsCode = strArr[0];
            jsCode = jsCode.split('=')[1] || '';
        } else {
            jsCode = '';
        }
        return jsCode;
    }

    // 通过每次进中间页读取cookie获取登录态
    function init() {
        var loginSessionId = method.getLoginSessionId();
        if (loginSessionId) {
            // 调取接口-获取token
            updateLoginToken(loginSessionId);
        } else {
            var href = window.location.href;
            var jsId = getParamsByUrl(href, 'ishare_jssid');
            var urlObj = duplicateToUrl(href);
            // url中存在ishare_jssid--表明是单点登录回传触发
            if (urlObj.isSSO && jsId) {
                console.error('重定向回传数据');
                method.saveLoginSessionId(jsId);
                // 调取接口-获取token
                updateLoginToken(jsId);
                window.location.href = urlObj.originUrl;
            } else {
                console.error('触发sso重定向');
                var params = encodeURIComponent(window.location.href);
                window.location.href = javaPath + params;
            }
        }
    }

    // 获取并且更新token
    function updateLoginToken(loginSessionId) {
        $.ajax({
            url: api.user.checkSso,
            type: "GET",
            async: false,
            headers: {
                jsId: loginSessionId
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (res) {
                console.log(res)
                if (res.code == '0' && res.data && res.data.access_token) {
                    method.saveLoginToken(res.data.access_token);
                } else {
                    method.delLoginToken();
                }
            }
        })
    }

    // 携带数据时，链接上已存在相关字段，进行去重处理
    function duplicateToUrl(href) {
        var isSSO = false;
        if (href.match('ishare_jssid')) {
            isSSO = true;
            var jsSid = getParamsByUrl(href, 'ishare_jssid');
            href = href.replace('#ishare_jssid=' + jsSid, '');
        }
        return {
            originUrl: href,
            isSSO: isSSO
        };
    }

    return {
        init: init
    }
})