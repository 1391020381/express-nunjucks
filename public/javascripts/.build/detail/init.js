define("dist/detail/init", [ "../common/baidu-statistics", "../application/method", "../cmd-lib/lazyload", "../cmd-lib/myDialog", "../cmd-lib/loading", "../detail/index", "../application/suspension", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/effect", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./common", "./template/pay_btn_tmp.html", "./template/pay_middle_tmp.html", "./template/pay_header.tmp.html", "./template/head_tip.html", "../detail/search", "./template/history_tmp.html", "./template/hot_search_tmp.html", "../detail/download", "../cmd-lib/toast", "../cmd-lib/gioInfo", "../detail/paging", "./template/img_box.html", "./changeShowOverText", "./download", "./index", "./changeDetailFooter", "../detail/expand", "../detail/buyUnlogin", "../pay/qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "./template/buyUnlogin.html", "../detail/paradigm4", "../detail/banner", "swiper", "./template/HotSpotSearch.html" ], function(require, exports, module) {
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
    // require("../detail/report");
    require("../detail/index");
    require("../detail/search");
    require("../detail/download");
    require("../detail/paging");
    require("../detail/expand");
    // require("../common/baidu-statistics");
    require("../detail/buyUnlogin");
    require("../common/bilog");
    require("../detail/paradigm4");
    require("../detail/banner");
});