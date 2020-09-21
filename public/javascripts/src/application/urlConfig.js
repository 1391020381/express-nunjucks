// 网站url 配置
define(function (require, exports, module) {
    // var envList = {
    //     'local':'',
    //     'dev':'',
    //     'test':'',
    //     'pre':'',
    //     'prod':''
    // }
    var urlConfig = {
        ajaxUrl: '',
        payUrl: '',
        loginUrl: ''
    }
    if (env == 'local') {
        urlConfig = {
            ajaxUrl: 'http://ishare.iask.sina.com.cn',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: ''
        }
    }

    if (env == 'dev') {
        urlConfig = {
            ajaxUrl: 'http://dev-ishare.iask.sina.com.cn',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: ''
        }
    }
    if (env == 'test') {
        urlConfig = {
            ajaxUrl: 'http://test-ishare.iask.sina.com.cn',
            payUrl: 'http://test-open-ishare.iask.com.cn',
            loginUrl: ''
        }
    }

    if (env == 'pre') {
        urlConfig = {
            ajaxUrl: 'http://pre-ishare.iask.sina.com.cn',
            payUrl: 'http://pre-open-ishare.iask.com.cn',
            loginUrl: ''
        }
    }

    if (env == 'prod') {
        urlConfig = {
            ajaxUrl: 'http://ishare.iask.sina.com.cn',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: ''
        }
    }
    return urlConfig
});