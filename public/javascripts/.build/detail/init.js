define("dist/detail/init", [ "../common/baidu-statistics", "../application/method", "../cmd-lib/lazyload", "../cmd-lib/myDialog", "../cmd-lib/loading", "../detail/report", "../cmd-lib/util", "../detail/search", "./template/history_tmp.html", "./template/hot_search_tmp.html", "../detail/download", "../cmd-lib/toast", "../cmd-lib/gioInfo", "./common", "../application/api", "./template/pay_btn_tmp.html", "./template/pay_middle_tmp.html", "./template/pay_header.tmp.html", "../application/checkLogin", "../detail/paging", "./template/img_box.html", "./changeShowOverText", "./download", "./index", "../application/suspension", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../report/config", "../report/init", "../report/handler", "../report/columns", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./template/head_tip.html", "./changeDetailFooter", "../detail/expand", "../detail/index", "../detail/buyUnlogin", "../pay/qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../pay/report", "./template/buyUnlogin.html", "../detail/paradigm4", "../detail/banner", "swiper", "./template/HotSpotSearch.html" ], function(require, exports, module) {
    require("../common/baidu-statistics").initBaiduStatistics("17cdd3f409f282dc0eeb3785fcf78a66");
    require("../cmd-lib/lazyload");
    require("../cmd-lib/myDialog");
    require("../cmd-lib/loading");
    require("../detail/report");
    require("../detail/search");
    require("../detail/download");
    require("../detail/paging");
    require("../detail/expand");
    require("../detail/index");
    // require("../common/baidu-statistics");
    require("../detail/buyUnlogin");
    require("../common/bilog");
    require("../detail/paradigm4");
    require("../detail/banner");
});