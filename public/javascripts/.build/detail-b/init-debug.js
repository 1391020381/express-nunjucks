define("dist/detail-b/init-debug", [ "../cmd-lib/lazyload-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/loading-debug", "../detail-b/index-debug", "../application/suspension-debug", "../application/method-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/urlConfig-debug", "../application/login-debug", "../cmd-lib/jqueryMd5-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/toast-debug", "../common/bindphone-debug", "../common/baidu-statistics-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/effect-debug", "../application/helper-debug", "./common-debug", "./template/pay_btn_tmp-debug.html", "./template/pay_middle_tmp-debug.html", "./template/pay_header.tmp-debug.html", "../detail-b/search-debug", "./template/history_tmp-debug.html", "./template/hot_search_tmp-debug.html", "../detail-b/download-debug", "../cmd-lib/gioInfo-debug", "../detail-b/paging-debug", "./template/img_box-debug.html", "./changeShowOverText-debug", "./download-debug", "./index-debug", "./changeDetailFooter-debug", "../detail-b/expand-debug", "../detail-b/buyUnlogin-debug", "../pay/qr-debug", "../cmd-lib/qr/qrcode.min-debug", "../cmd-lib/qr/jquery.qrcode.min-debug", "../common/bilog-module/payFileResultForVisit_bilog-debug", "./template/buyUnlogin-debug.html", "../detail-b/paradigm4-debug", "../detail-b/banner-debug", "swiper-debug", "./template/HotSpotSearch-debug.html" ], function(require, exports, module) {
    require("../cmd-lib/lazyload-debug");
    require("../cmd-lib/myDialog-debug");
    require("../cmd-lib/loading-debug");
    require("../detail-b/index-debug");
    require("../detail-b/search-debug");
    require("../detail-b/download-debug");
    require("../detail-b/paging-debug");
    require("../detail-b/expand-debug");
    require("../detail-b/buyUnlogin-debug");
    require("../common/bilog-debug");
    require("../detail-b/paradigm4-debug");
    require("../detail-b/banner-debug");
    require("../common/baidu-statistics-debug").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    require("../common/baidu-statistics-debug").initBaiduStatistics("adb0f091db00ed439bf000f2c5cbaee7");
    var productType = window.pageConfig.params && window.pageConfig.params.productType;
    if (productType == "4") {
        require("../common/baidu-statistics-debug").initBaiduStatistics("504d2c29e8aefe02ad5d66207e4de083");
    }
    if (productType == "1") {
        require("../common/baidu-statistics-debug").initBaiduStatistics("c0fb058099c13a527871d024b1d809f8");
    }
});