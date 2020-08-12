define("dist/office/pay/init", [ "../../cmd-lib/tab", "../../cmd-lib/toast", "../../cmd-lib/myDialog", "./report", "./pay", "../common/suspension", "../../application/method", "../../application/checkLogin", "../../application/api", "../../application/login", "../../cmd-lib/jqueryMd5", "../../common/bilog", "base64", "../../cmd-lib/util", "../../report/config", "../../common/bindphone", "../../common/baidu-statistics", "../../application/app", "../../application/element", "../../application/template", "../../application/extend", "../../application/effect", "../../application/helper", "./qr", "../../cmd-lib/qr/qrcode.min", "../../cmd-lib/qr/jquery.qrcode.min" ], function(require, exports, module) {
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