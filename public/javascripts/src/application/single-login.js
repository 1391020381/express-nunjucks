define(function (require) {
    var method = require("../method");
    var api = require("../api");
    var loginModule = require('../login/checkLogin');
    // 根据环境读取登录页url
    var javaPath = window._loginUrl + '/login-common.html?redirectUrl=';

    // 获取参数中字段
    function formatUrlToParams(url) {
        // #jsCode=
        var strArr = url.split('#jsCode=');
        var originUrl = strArr[0];
        var params = '';
        var jsCode = strArr[1];
        if (jsCode) {
            // 优先截取& 其次截取#
            strArr = jsCode.split('&');
            jsCode = strArr[0];
            if (strArr.length > 1) {
                strArr.shift();
                params += '&' + strArr.join('&');
            }
            strArr = jsCode.split('#');
            jsCode = strArr[0];
            if (strArr.length > 1) {
                strArr.shift();
                params += '#' + strArr.join('#');
            }
            // url存在参数连接符
            if (originUrl.indexOf('?') !== -1 || originUrl.indexOf('#') !== -1) {
                originUrl = originUrl + params;
            } else {
                if (params) {
                    params = params.slice(1);
                    originUrl = originUrl + '?' + params;
                }
            }
        } else {
            jsCode = '';
        }

        return {
            originUrl: originUrl,
            jsCode: jsCode
        };
    }

    // 通过每次进中间页读取cookie获取登录态
    function init() {
        // // 获取用户token
        // var href = window.location.href;
        // var jsCode = getParamsByUrl(href, 'ishare_jscode');
        // var originUrl = duplicateToUrl(href);
        //
        // console.log('获取url上携带数据', href, jsCode, originUrl);
        // if (jsCode) {
        //     if (jsCode === 'false') {
        //         console.error('sso重定向回来-未登录');
        //         method.delLoginToken();
        //     } else {
        //         console.error('sso重定向回来-登录');
        //         method.saveLoginToken(jsCode);
        //     }
        //     method.saveLocalRedirect(true);
        //     window.location.href = originUrl;
        // } else {
        //     // 本地触发-非登录中心触发的重定向
        //     if (method.getLocalRedirect()) {
        //         console.error('是本地主动触发-为移除url后面多余参数');
        //         method.delLocalRedirect();
        //     } else {
        //         console.error('触发sso重定向');
        //         var params = encodeURIComponent(window.location.href) + '&loginType=checkLogin';
        //         window.location.href = javaPath + params;
        //     }
        // }
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