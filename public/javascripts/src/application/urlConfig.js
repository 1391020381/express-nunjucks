// 网站url 配置
define(function (require, exports, module) {
    var env = window.env
    var urlConfig = {
        debug: {
            ajaxUrl: 'http://localhost:3004',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        local: {
            ajaxUrl: 'http://localhost:3004',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        dev: {
            ajaxUrl: 'http://dev-ishare.iask.com.cn',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        test: {
            ajaxUrl: 'http://test-ishare.iask.com.cn',
            payUrl: 'http://test-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        pre: {
            ajaxUrl: 'http://pre-ishare.iask.com.cn',
            payUrl: 'http://pre-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        prod: {
            ajaxUrl: 'http://ishare.iask.sina.com.cn/',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: ''
        }
    }


    return urlConfig[env]
});