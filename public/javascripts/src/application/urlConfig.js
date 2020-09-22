// 网站url 配置
define(function (require, exports, module) {
    var env = window.env
    var urlConfig = {
        debug: {
            ajaxUrl: 'http://localhost:3004',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
        },
        local: {
            ajaxUrl: 'http://localhost:3004',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
        },
        dev: {
            ajaxUrl: 'http://dev-ishare.iask.com.cn',
            payUrl: 'http://dev-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://dev-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
        },
        test: {
            ajaxUrl: 'http://test-ishare.iask.com.cn',
            payUrl: 'http://test-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://test-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
        },
        pre: {
            ajaxUrl: 'http://pre-ishare.iask.com.cn',
            payUrl: 'http://pre-open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://pre-upload.ishare.iask.com/ishare-upload/picUploadCatalog"
        },
        prod: {
            ajaxUrl: 'http://ishare.iask.sina.com.cn/',
            payUrl: 'http://open-ishare.iask.com.cn',
            loginUrl: '',
            upload:"http://upload.ishare.iask.com/ishare-upload/picUploadCatalog"
        }
    }


    return urlConfig[env]
});