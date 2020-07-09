define("dist/pay/init-debug", [ "../cmd-lib/tab-debug", "../cmd-lib/toast-debug", "../cmd-lib/myDialog-debug", "./effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/method-debug", "../application/app-debug", "../application/element-debug", "../application/template-debug", "../application/extend-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../application/helper-debug", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min-debug", "./pay-debug", "swiper-debug", "./qr-debug", "../cmd-lib/qr/qrcode.min-debug", "../cmd-lib/qr/jquery.qrcode.min-debug", "../common/coupon/couponOperate-debug", "../common/coupon/template/options-debug.html", "../common/coupon/couponIssue-debug", "../cmd-lib/loading-debug", "../common/coupon/template/couponCard-debug.html", "./banner-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug", "../common/bindphone-debug" ], function(require, exports, module) {
    // var $ = require("$");
    require("../cmd-lib/tab-debug");
    require("../cmd-lib/toast-debug");
    require("../cmd-lib/myDialog-debug");
    require("./effect-debug");
    // 登录和刷新topbar
    //  require("./report");  
    require("./pay-debug");
    require("./banner-debug");
    require("../common/bindphone-debug");
    require("../common/bilog-debug");
});