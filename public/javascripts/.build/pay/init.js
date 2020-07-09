define("dist/pay/init", [ "../cmd-lib/tab", "../cmd-lib/toast", "../cmd-lib/myDialog", "./effect", "../application/checkLogin", "../application/api", "../application/method", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../cmd-lib/util", "../report/config", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./pay", "swiper", "./qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../common/coupon/couponOperate", "../common/coupon/template/options.html", "../common/coupon/couponIssue", "../cmd-lib/loading", "../common/coupon/template/couponCard.html", "./banner", "../common/template/swiper_tmp.html", "../common/recommendConfigInfo", "../common/bindphone" ], function(require, exports, module) {
    // var $ = require("$");
    require("../cmd-lib/tab");
    require("../cmd-lib/toast");
    require("../cmd-lib/myDialog");
    require("./effect");
    // 登录和刷新topbar
    //  require("./report");  
    require("./pay");
    require("./banner");
    require("../common/bindphone");
    require("../common/bilog");
});