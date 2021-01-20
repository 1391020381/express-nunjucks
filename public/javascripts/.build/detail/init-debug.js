define("dist/detail/init-debug", [ "../common/testBilog-debug", "../cmd-lib/lazyload-debug", "../cmd-lib/myDialog-debug", "../cmd-lib/loading-debug", "./userComments-debug", "../application/method-debug", "../application/api-debug", "../application/urlConfig-debug", "./template/simplePagination-debug.html", "./template/userComments-debug.html", "./guessYouLike-debug", "../common/paradigm4-report-debug", "./template/guessYouLike-debug.html", "./relevantInformation-debug", "./template/relevantInformation-debug.html", "./download-debug", "../cmd-lib/toast-debug", "../cmd-lib/util-debug", "./common-debug", "./template/pay_btn_tmp-debug.html", "./template/pay_middle_tmp-debug.html", "./template/pay_header.tmp-debug.html", "../common/loginType-debug", "../application/checkLogin-debug", "../application/login-debug", "../application/loginOperationLogic-debug", "../cmd-lib/jqueryMd5-debug", "../common/bindphone-debug", "../application/iframe/iframe-messenger-debug", "../application/iframe/messenger-debug", "../common/baidu-statistics-debug", "./index-debug", "../application/suspension-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilogReport-debug", "../application/effect-debug", "../application/helper-debug", "../application/single-login-debug", "./search-debug", "./template/history_tmp-debug.html", "./template/hot_search_tmp-debug.html", "./paging-debug", "./template/img_box-debug.html", "./changeShowOverText-debug", "./changeDetailFooter-debug", "./expand-debug", "./buyUnlogin-debug", "../pay/qr-debug", "../cmd-lib/qr/qrcode.min-debug", "../cmd-lib/qr/jquery.qrcode.min-debug", "./template/buyUnlogin-debug.html", "./banner-debug", "swiper-debug", "./template/HotSpotSearch-debug.html" ], function(require, exports, module) {
    require("../common/testBilog-debug");
    require("../cmd-lib/lazyload-debug");
    require("../cmd-lib/myDialog-debug");
    require("../cmd-lib/loading-debug");
    require("./userComments-debug");
    require("./guessYouLike-debug");
    require("./relevantInformation-debug");
    require("./download-debug");
    require("./index-debug");
    require("./search-debug");
    // require("./download");
    require("./paging-debug");
    require("./expand-debug");
    require("./buyUnlogin-debug");
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