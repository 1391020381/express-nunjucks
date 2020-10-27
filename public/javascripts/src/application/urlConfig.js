// 网站url 配置
define(function (require, exports, module) {
    var env = window.env
    var urlConfig = {
        debug: {
            ajaxUrl: '',
            payUrl: 'http://open-ishare.iask.com.cn',
            upload:"//upload-ishare.iask.com",
             appId:'wxb8af2801b7be4c37',
             bilogUrl:"https://dw.iask.com.cn/ishare/jsonp?data=",
             officeUrl:'http://office.iask.com' 
        },
        local: {
            ajaxUrl: '',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            upload:"//dev-upload-ishare.iask.com",
            appId:'wxb8af2801b7be4c37',
            bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl:'http://dev-office.iask.com' 
        },
        dev: {
            ajaxUrl: '',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            upload:"//dev-upload-ishare.iask.com",
            appId:'wxb8af2801b7be4c37',
            bilogUrl:"https://dev-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl:'http://dev-office.iask.com' 
        },
        test: {
            ajaxUrl: '',
            payUrl: 'http://test-open-ishare.iask.com.cn',
            upload:"//test-upload-ishare.iask.com",
            appId:'wxb8af2801b7be4c37',
            bilogUrl:"https://test-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl:'http://test-office.iask.com' 
        },
        pre: {
            ajaxUrl: '',
            payUrl: 'http://pre-open-ishare.iask.com.cn',
            upload:"//pre-upload-ishare.iask.com",
            appId: 'wxca8532521e94faf4',
            bilogUrl:"https://pre-dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl:'http://pre-office.iask.com'
        },
        prod: {
            ajaxUrl: '',
            payUrl: 'http://open-ishare.iask.com.cn',
            upload:"//upload-ishare.iask.com",
            appId: 'wxca8532521e94faf4',
            bilogUrl:"https://dw.iask.com.cn/ishare/jsonp?data=",
            officeUrl:'http://office.iask.com'
        }
    }


    return urlConfig[env]
});