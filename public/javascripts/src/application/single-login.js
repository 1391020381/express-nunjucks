define(function (require) {
    var method = require('./method');
    var api = require('./api');

    // 根据环境读取登录页url
    var javaPath = loginUrl || 'http://login-ishare.iask.com.cn/gateway/cas/login/jump?redirectUrl=';

    // 验证sessionID，然后获取token
    function getLoginToken(jsId) {
        // 获取本地token
        var localToken = method.getLoginToken();
        // 查询token
        method.customAjax({
            type: 'GET',
            url: '/cc/aa',
            async: false,
            cache: false,
            headers: {
                'isharejsid': jsId
            },
            success: function (res) {
                if (res.code === '0' && res.data && res.data.access_token) {
                    // 本地token已失效，保存本地后需触发页面刷新，保证获取登录后数据
                    if (localToken !== res.data.access_token) {
                        method.saveLoginToken(res.data.access_token);
                        window.location.reload();
                    }
                } else {
                    // 清除本地token
                    method.delLoginToken();
                }
            },
            error: function () {
                // 清除本地token
                method.delLoginToken();
            }
        });
    }

    // 通过每次进中间页获取jsId
    function init() {
        // debugger;
        var loginSessionId = method.getLoginSessionId();
        if (loginSessionId) {
            // 调取接口-验证jsId，获取token
            getLoginToken(loginSessionId);
        } else {
            var href = window.location.href;
            var localRedtId = method.getCookie('ISHREDIRECT');
            var urlRedtId = method.getParamsByName(href, 'ishredtid');
            // 此种方式-通过在cookie中存储跳转标识，但不保证当次一定为重定向回传过来
            // 添加时间戳或者唯一标识，通过返回的url是否携带标识来判断是否是对应触发返回
            if (localRedtId && localRedtId === urlRedtId) {
                // 重定向回传触发-清除标识，保存数据
                method.delCookie('ISHREDIRECT', '/');
                var jsId = method.getParamsByName(href, 'isharejsid');
                if (jsId) {
                    // 先保存到cookie，请求时统一先去cookie中获取
                    method.saveLoginSessionId(jsId);
                    // 调取接口-验证jsId，获取token
                    getLoginToken(jsId);
                }
            } else {
                var redtid = method.randomString(6);
                // 保存重定向触发标识保存1分钟
                method.setCookieWithExpPath('ISHREDIRECT', redtid, 60000, '/');
                if (href.match('ishredtid')) {
                    href = href.replace('ishredtid=' + urlRedtId, 'ishredtid=' + redtid);
                } else {
                    // 先判断链接上是否存在 ? #
                    if (href.match(/[\\?#]/)) {
                        href = href + '&ishredtid=' + redtid;
                    } else {
                        href = href + '#ishredtid=' + redtid;
                    }
                }
                window.location.replace(javaPath + encodeURIComponent(href));
            }
        }
    }

    return {
        init: init
    };
});
