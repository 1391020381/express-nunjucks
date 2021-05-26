// 网站url 配置
define(function (require, exports, module) {
    var env = window.env;
    var payUrl = window.payUrl
    var upload = window.upload
    var bilogUrl = window.bilogUrl
    var officeUrl = window.officeUrl
    var ejunshi = window.ejunshi
    var urlConfig = {
        debug: {},
        local: {},
        dev: {},
        test: {},
        pre: {},
        prod: {}
    };

    urlConfig[env] = {
        payUrl: payUrl,
        upload: upload,
        bilogUrl: bilogUrl,
        officeUrl: officeUrl,
        ejunshi: ejunshi,
        ajaxUrl: ''
    }
    return $.extend({}, urlConfig[env], { site: 4, terminal: '0' })
});
