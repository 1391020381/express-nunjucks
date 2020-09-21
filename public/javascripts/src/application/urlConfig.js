// 网站url 配置
define(function (require, exports, module) {
    var env = window.env
    var urlConfig = {
        local: {
            ajaxUrl: 'http://localhost:3004',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        dev: {
            ajaxUrl: 'http://dev-ishare.com.cn',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        test: {
            ajaxUrl: 'http://dev-ishare.com.cn',
            payUrl: 'http://test-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        pre: {
            ajaxUrl: 'http://pre-ishare.com.cn',
            payUrl: 'http://pre-open-ishare.iask.com.cn',
            loginUrl: ''
        },
        prod: {
            ajaxUrl: 'http://dev-ishare.com.cn',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: ''
        }
    }


    return urlConfig[env]
});