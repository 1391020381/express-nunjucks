define("dist/pay/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "../application/effect", "../application/checkLogin", "../application/api", "../application/method", "../application/login", "../cmd-lib/jqueryMd5", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../common/bindphone", "../common/baidu-statistics", "./pay", "../common/bilog-module/payVipResult_bilog", "../common/bilog-module/payFileResult_bilog", "../common/bilog-module/payPrivilegeResult_bilog", "swiper", "./qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../common/coupon/couponOperate", "../common/coupon/template/options.html", "../common/coupon/couponIssue", "../cmd-lib/loading", "../common/coupon/template/couponCard.html", "./banner", "../common/template/swiper_tmp.html", "../common/recommendConfigInfo" ], function(require, exports, module) {
    // var $ = require("$");
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    var isLogin = require("../application/effect").isLogin;
    //  require("./effect");  // 登录和刷新topbar
    var isAutoLogin = true;
    var callback = null;
    isLogin(null, false);
    //  require("./report");  
    require("./pay");
    require("./banner");
    require("../common/bindphone");
    require("../common/bilog");
});