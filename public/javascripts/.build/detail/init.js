define("dist/detail/init", [ "../common/testBilog", "../cmd-lib/lazyload", "../cmd-lib/myDialog", "../cmd-lib/loading", "./userComments", "../application/api", "../application/urlConfig", "./template/simplePagination.html", "./template/userComments.html", "./guessYouLike", "../common/paradigm4-report", "../application/method", "./template/guessYouLike.html", "./relevantInformation", "./template/relevantInformation.html", "./download", "../cmd-lib/toast", "../cmd-lib/util", "./common", "./template/pay_btn_tmp.html", "../common/loginType", "../application/checkLogin", "../application/login", "../application/loginOperationLogic", "../cmd-lib/jqueryMd5", "../common/bindphone", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilogReport", "../application/helper", "../application/single-login", "./search", "./template/history_tmp.html", "./template/hot_search_tmp.html", "./paging", "./template/img_box.html", "./changeShowOverText", "./changeDetailFooter", "./expand", "./buyUnlogin", "../pay/qr", "../cmd-lib/qr/qrcode.min", "./banner", "swiper", "./template/HotSpotSearch.html" ], function(require, exports, module) {
    require("../common/testBilog");
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
    require("./userComments");
    require("./guessYouLike");
    require("./relevantInformation");
    require("./download");
    require("./index");
    require("./search");
    // require("./download");
    require("./paging");
    require("./expand");
    require("./buyUnlogin");
    require("./banner");
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    require("../common/baidu-statistics").initBaiduStatistics("adb0f091db00ed439bf000f2c5cbaee7");
    var productType = window.pageConfig.params && window.pageConfig.params.productType;
    if (productType == "4") {
        require("../common/baidu-statistics").initBaiduStatistics("504d2c29e8aefe02ad5d66207e4de083");
    }
    if (productType == "1") {
        require("../common/baidu-statistics").initBaiduStatistics("c0fb058099c13a527871d024b1d809f8");
    }
});