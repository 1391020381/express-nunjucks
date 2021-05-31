// 网站url 配置
define(function (require, exports, module) {
    var env = window.env;
    var payUrl = window.payUrl;
    var upload = window.upload;
    var bilogUrl = window.bilogUrl;
    var officeUrl = window.officeUrl;
    var ejunshi = window.ejunshi;
    var fileConvertSite = window.fileConvertSite;
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
        fileConvertSite: fileConvertSite,
        ajaxUrl: '',
        fileConvertSitePath: {
            pdftoword: '/converter/pdftoword/', // 搜索页VIP格式转换跳转pdf转world
            pdfencrypt: '/converter/pdfencrypt/',
            pdfmerge: '/converter/pdfmerge/', // 合并
            pdfsplit: '/converter/pdfsplit/' // 拆分
        }
    };
    return $.extend({}, urlConfig[env], { site: 4, terminal: '0' });
});
