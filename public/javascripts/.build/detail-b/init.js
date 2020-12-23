define("dist/detail-b/init", [ "../cmd-lib/lazyload", "../cmd-lib/myDialog", "../cmd-lib/loading", "./userComments", "../application/method", "../application/api", "../application/urlConfig", "./template/simplePagination.html", "./template/userComments.html", "./index", "../application/suspension", "../application/checkLogin", "../application/login", "../cmd-lib/toast", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/loadSentry", "../application/effect", "../common/loginType", "../application/helper", "../application/single-login", "../cmd-lib/util", "./common", "./template/pay_btn_tmp.html", "./template/pay_middle_tmp.html", "./template/pay_header.tmp.html", "./search", "./template/history_tmp.html", "./template/hot_search_tmp.html", "./download", "./paging", "./template/img_box.html", "./changeShowOverText", "./changeDetailFooter", "./expand", "./buyUnlogin", "../pay/qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "./template/buyUnlogin.html", "./paradigm4", "./banner", "swiper", "./template/HotSpotSearch.html" ], function(require, exports, module) {
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
    require("./userComments");
    require("./index");
    require("./search");
    require("./download");
    require("./paging");
    require("./expand");
    require("./buyUnlogin");
    require("./paradigm4");
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