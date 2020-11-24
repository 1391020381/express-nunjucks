define("dist/detail-b/init-debug", [ "../cmd-lib/lazyload-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/loading-debug", "./userComments-debug", "../application/method-debug", "../application/api-debug", "../application/urlConfig-debug", "./template/simplePagination-debug.html", "./template/userComments-debug.html", "./index-debug", "../application/suspension-debug", "../application/checkLogin-debug", "../application/login-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../cmd-lib/toast-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../application/effect-debug", "../common/loginType-debug", "../application/helper-debug", "../application/single-login-debug", "./common-debug", "./template/pay_btn_tmp-debug.html", "./template/pay_middle_tmp-debug.html", "./template/pay_header.tmp-debug.html", "./search-debug", "./template/history_tmp-debug.html", "./template/hot_search_tmp-debug.html", "./download-debug", "../cmd-lib/gioInfo-debug", "./paging-debug", "./template/img_box-debug.html", "./changeShowOverText-debug", "./changeDetailFooter-debug", "./expand-debug", "./buyUnlogin-debug", "../pay/qr-debug", "../cmd-lib/qr/qrcode.min-debug", "../cmd-lib/qr/jquery.qrcode.min-debug", "../common/bilog-module/payFileResultForVisit_bilog-debug", "./template/buyUnlogin-debug.html", "./paradigm4-debug", "./banner-debug", "swiper-debug", "./template/HotSpotSearch-debug.html" ], function(require, exports, module) {
    require("../cmd-lib/lazyload-debug");
    require("../cmd-lib/myDialog-debug");
    require("../cmd-lib/loading-debug");
    require("./userComments-debug");
    require("./index-debug");
    require("./search-debug");
    require("./download-debug");
    require("./paging-debug");
    require("./expand-debug");
    require("./buyUnlogin-debug");
    require("../common/bilog-debug");
    require("./paradigm4-debug");
    require("./banner-debug");
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