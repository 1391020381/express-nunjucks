// 网站url 配置
define(function (require, exports, module) {
    var env = window.env
    var urlConfig = {
        debug: {
            ajaxUrl: 'http://localhost:3004',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://upload.ishare.iask.com/ishare-upload/picUploadCatalog",
             appId:'wxb8af2801b7be4c37',
        },
        local: {
            ajaxUrl: 'http://localhost:3004',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog",
            appId:'wxb8af2801b7be4c37',
        },
        dev: {
            ajaxUrl: '',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog",
            appId:'wxb8af2801b7be4c37',
        },
        test: {
            ajaxUrl: '',
            payUrl: 'http://test-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://test-upload.ishare.iask.com/ishare-upload/picUploadCatalog",
            appId:'wxb8af2801b7be4c37',
        },
        pre: {
            ajaxUrl: '',
            payUrl: 'http://pre-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://pre-upload.ishare.iask.com/ishare-upload/picUploadCatalog",
            appId: 'wxb78229eb7470875b'
        },
        prod: {
            ajaxUrl: '',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://upload.ishare.iask.com/ishare-upload/picUploadCatalog",
            appId: 'wxb78229eb7470875b'
        }
    }


    return urlConfig[env]
});