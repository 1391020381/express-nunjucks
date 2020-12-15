define("dist/pay/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "./pay", "swiper", "../application/method", "../cmd-lib/util", "./qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../application/urlConfig", "../application/api", "./couponReceive.html", "../application/effect", "../application/checkLogin", "../application/login", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/baidu-statistics", "../common/loginType", "../common/coupon/couponOperate", "../common/coupon/template/options.html", "../common/coupon/couponIssue", "../cmd-lib/loading", "../common/coupon/template/couponCard.html" ], function(require, exports, module) {
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    require("./pay");
});