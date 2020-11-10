define(function (require) {
    var method = require("./method");
    var api = require("./api");
    // 根据环境读取登录页url
    var javaPath = loginUrl + '/login-common.html?redirectUrl=';

    // 通过每次进中间页读取cookie获取登录态
    function init() {
        // var loginToken = method.getLoginToken();
        var loginSessionId = method.getLoginSessionId();
        if (loginSessionId) {
            // 调取接口-获取token
            $.ajax({
                headers:{
                    'Authrization':method.getCookie('cuk')
                },
                url: api.user.checkSso+'?jsId=' + loginSessionId,
                type: "GET",
                async:true,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (res) {
                        console.log(res)
                        if(res.code == '0'&& res.data && res.data.access_token){
                            method.saveLoginToken(res.data.access_token);
                        }else{
                            method.delLoginToken();
                        }
                }
            })

        } else {
            // 重定向回传触发
            if (method.getLocalRedirect()) {
                console.error('重定向回传');
                method.delLocalRedirect();
                var href = window.location.href;
                var jsId = getParamsByUrl(href, 'ishare_jssid');
                method.saveLoginSessionId(jsId);
                // 调取接口-获取token
                $.ajax({
                    headers:{
                        'Authrization':method.getCookie('cuk')
                    },
                    url: api.user.checkSso+'?jsId=' + loginSessionId,
                    type: "GET",
                    async:true,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (res) {
                            console.log(res)
                            if(res.code == '0'&& res.data && res.data.access_token){
                                method.saveLoginToken(res.data.access_token);
                            }else{
                                method.delLoginToken();
                            }
                    }
                })
            } else {
                console.error('触发sso重定向');
                method.saveLocalRedirect(true);
                var params = encodeURIComponent(window.location.href);
                window.location.href = javaPath + params;
            }
        }
    }

    // 获取参数中字段 // ?a=2&b=3#jsCode =111&jsId=2222
    function getParamsByUrl(url, name) {
        var strArr = url.split(name);
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

    // 携带数据时，链接上已存在相关字段，进行去重处理
    function duplicateToUrl(href) {
        if (href.match('ishare_jscode')) {
            var jsCode = getParamsByUrl(href, 'ishare_jscode');
            href = href.replace('#ishare_jscode=' + jsCode, '');
        }
        if (href.match('ishare_jssid')) {
            var jsSid = getParamsByUrl(href, 'ishare_jssid');
            href = href.replace('#ishare_jssid=' + jsSid, '');
        }
        if (href.match('ishare_jsurl')) {
            var jsUrl = getParamsByUrl(href, 'ishare_jsurl');
            href = href.replace('#ishare_jsurl=' + jsUrl, '');
        }
        return href;
    }

    return {
        init: init
    }
})