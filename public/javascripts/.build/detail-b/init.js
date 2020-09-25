define("dist/detail-b/init", [ "../cmd-lib/lazyload", "../cmd-lib/myDialog", "../cmd-lib/loading", "../detail-b/index", "../application/suspension", "../application/method", "../application/checkLogin", "../application/api", "../application/urlConfig", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../cmd-lib/toast", "../common/bindphone", "../common/baidu-statistics", "../application/app", "../application/element", "../application/template", "../application/extend", "../application/effect", "../application/helper", "./common", "./template/pay_btn_tmp.html", "./template/pay_middle_tmp.html", "./template/pay_header.tmp.html", "../detail-b/search", "./template/history_tmp.html", "./template/hot_search_tmp.html", "../detail-b/download", "../cmd-lib/gioInfo", "../detail-b/paging", "./template/img_box.html", "./changeShowOverText", "./download", "./index", "./changeDetailFooter", "../detail-b/expand", "../detail-b/buyUnlogin", "../pay/qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../common/bilog-module/payFileResultForVisit_bilog", "./template/buyUnlogin.html", "../detail-b/paradigm4", "../detail-b/banner", "swiper", "./template/HotSpotSearch.html" ], function(require, exports, module) {
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
    require("../detail-b/index");
    require("../detail-b/search");
    require("../detail-b/download");
    require("../detail-b/paging");
    require("../detail-b/expand");
    require("../detail-b/buyUnlogin");
    require("../common/bilog");
    require("../detail-b/paradigm4");
    require("../detail-b/banner");
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