define("dist/office/pay/init", [ "../../cmd-lib/tab", "../../cmd-lib/toast", "../../cmd-lib/myDialog", "./report", "./pay", "../common/suspension", "../../application/method", "../../application/checkLogin", "../../application/api", "../../application/app", "../../application/element", "../../application/template", "../../application/extend", "../../common/bilog", "base64", "../../cmd-lib/util", "../../report/config", "../../report/init", "../../report/handler", "../../report/columns", "../../application/helper", "//static3.iask.cn/resource/js/plugins/pc.iask.login.min", "./qr", "../../cmd-lib/qr/qrcode.min", "../../cmd-lib/qr/jquery.qrcode.min", "../../common/bindphone" ], function(require, exports, module) {
    // var $ = require("$");
    require("../../cmd-lib/tab");
    require("../../cmd-lib/toast");
    require("../../cmd-lib/myDialog");
    require("./report");
    require("./pay");
    require("../../common/bindphone");
    require("../common/suspension");
    require("../../common/bilog");
});