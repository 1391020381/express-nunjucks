define("dist/pay/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "./pay", "swiper", "../application/method", "../cmd-lib/util", "./qr", "../cmd-lib/qr/qrcode.min", "../common/baidu-statistics", "../application/urlConfig", "../application/api", "./couponReceive.html", "../application/effect", "../application/checkLogin", "../application/login", "../application/loginOperationLogic", "../cmd-lib/jqueryMd5", "../common/bindphone", "../application/iframe/iframe-messenger", "../application/iframe/messenger", "../common/loginType", "../common/associateWords", "../common/coupon/couponOperate", "../common/coupon/template/options.html", "../common/coupon/couponIssue", "../cmd-lib/loading", "../common/coupon/template/couponCard.html" ], function(require) {
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    require("./pay");
    require("../common/bindphone");
});