define("dist/pay/init-debug", [ "../cmd-lib/tab-debug", "../cmd-lib/toast-debug", "../cmd-lib/myDialog-debug", "../application/effect-debug", "../application/checkLogin-debug", "../application/api-debug", "../application/method-debug", "../application/login-debug", "../cmd-lib/jqueryMd5-debug", "../application/iframe/iframe-parent-debug", "../application/iframe/messenger-debug", "../common/bilog-debug", "base64-debug", "../cmd-lib/util-debug", "../report/config-debug", "../common/bindphone-debug", "../common/baidu-statistics-debug", "./pay-debug", "../common/bilog-module/payVipResult_bilog-debug", "../common/bilog-module/payFileResult_bilog-debug", "../common/bilog-module/payPrivilegeResult_bilog-debug", "swiper-debug", "./qr-debug", "../cmd-lib/qr/qrcode.min-debug", "../cmd-lib/qr/jquery.qrcode.min-debug", "../common/coupon/couponOperate-debug", "../common/coupon/template/options-debug.html", "../common/coupon/couponIssue-debug", "../cmd-lib/loading-debug", "../common/coupon/template/couponCard-debug.html", "./banner-debug", "../common/template/swiper_tmp-debug.html", "../common/recommendConfigInfo-debug" ], function(require, exports, module) {
    // var $ = require("$");
    require("../cmd-lib/tab-debug");
    require("../cmd-lib/toast-debug");
    require("../cmd-lib/myDialog-debug");
    var isLogin = require("../application/effect-debug").isLogin;
    //  require("./effect");  // 登录和刷新topbar
    var isAutoLogin = true;
    var callback = null;
    isLogin(null, false);
    //  require("./report");  
    require("./pay-debug");
    require("./banner-debug");
    require("../common/bindphone-debug");
    require("../common/bilog-debug");
});