// 网站url 配置
define(function (require, exports, module) {
    var env = window.env
    var urlConfig = {
        debug: {
            ajaxUrl: '',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://upload-ishare.iask.com",
             appId:'wxb8af2801b7be4c37',
             bilogUrl:"https://dw.iask.com.cn/ishare/jsonp?data="
        },
        local: {
            ajaxUrl: '',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://dev-upload-ishare.iask.com",
            appId:'wxb8af2801b7be4c37',
            bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp?data="
        },
        dev: {
            ajaxUrl: '',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://dev-upload-ishare.iask.com",
            appId:'wxb8af2801b7be4c37',
            bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp?data="
        },
        test: {
            ajaxUrl: '',
            payUrl: 'http://test-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://test-upload-ishare.iask.com",
            appId:'wxb8af2801b7be4c37',
            bilogUrl:"https://test-dw.iask.com.cn/ishare/jsonp?data="
        },
        pre: {
            ajaxUrl: '',
            payUrl: 'http://pre-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://pre-upload-ishare.iask.com",
            appId: 'wxca8532521e94faf4',
            bilogUrl:"https://pre-dw.iask.com.cn/ishare/jsonp?data="
        },
        prod: {
            ajaxUrl: '',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://upload-ishare.iask.com",
            appId: 'wxca8532521e94faf4',
            bilogUrl:"https://dw.iask.com.cn/ishare/jsonp?data="
        }
    }


    return urlConfig[env]
});