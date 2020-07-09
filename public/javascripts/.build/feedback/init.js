define("dist/feedback/init", [ "./buyUnlogin", "../cmd-lib/util", "../application/method", "../pay/qr", "../cmd-lib/qr/qrcode.min", "../cmd-lib/qr/jquery.qrcode.min", "../cmd-lib/gioInfo", "../detail/template/buyUnlogin.html", "./index", "../application/suspension", "../application/checkLogin", "../application/api", "../application/app", "../application/element", "../application/template", "../application/extend", "../common/bilog", "base64", "../report/config", "../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "../cmd-lib/toast", "./fixedTopBar", "../common/userMoreMsg" ], function(require, exports, module) {
    require("./buyUnlogin");
    require("./index");
    require("./fixedTopBar");
    require("../common/userMoreMsg");
    require("../application/suspension");
});