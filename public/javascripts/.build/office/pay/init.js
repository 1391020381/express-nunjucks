define("dist/office/pay/init", [ "../../cmd-lib/tab", "../../cmd-lib/toast", "../../cmd-lib/myDialog", "./report", "./pay", "../common/suspension", "../../application/method", "../../application/checkLogin", "../../application/api", "../../application/urlConfig", "../../application/login", "../../common/bilog", "base64", "../../cmd-lib/util", "../../report/config", "../../application/iframe/iframe-messenger", "../../application/iframe/messenger", "../../common/baidu-statistics", "../../application/app", "../../application/element", "../../application/template", "../../application/extend", "../../application/effect", "../../application/helper", "../../application/single-login", "../../method", "../../api", "../../login/checkLogin", "./qr", "../../cmd-lib/qr/qrcode.min", "../../cmd-lib/qr/jquery.qrcode.min", "../../common/bindphone" ], function(require, exports, module) {
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