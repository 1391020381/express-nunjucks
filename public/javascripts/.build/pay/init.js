define("dist/pay/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "./pay", "../common/bilog-module/payVipResult_bilog", "../common/bilog", "base64", "../cmd-lib/util", "../application/method", "../report/config", "../application/urlConfig", "../common/bilog-module/payFileResult_bilog", "../common/bilog-module/payPrivilegeResult_bilog", "swiper", "./qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../application/api", "./couponReceive.html", "../application/effect", "../application/checkLogin", "../application/login", "../cmd-lib/jqueryMd5", "../common/bindphone", "../common/baidu-statistics", "../common/coupon/couponOperate", "../common/coupon/template/options.html", "../common/coupon/couponIssue", "../cmd-lib/loading", "../common/coupon/template/couponCard.html" ], function(require, exports, module) {
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    require("./pay");
});